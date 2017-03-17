/**
 * @package @cyrhla/loader
 * @license MIT
 * @copyright Krystian Pietruszka <kpietru@cyrhla.com>
 * @see http://www.cyrhla.com
 */

'use strict'

const fs                               = require('fs')
const path                             = require('path')
const Yaml                             = require('yamljs')
const Xml2Js                           = require('xml2js')
const array_merge_recursive            = require('locutus/php/array/array_merge_recursive')
const is                               = require('@cyrhla/tester/is')
const valid                            = require('@cyrhla/tester/valid')
const DefaultXmlNormalizer             = require('@cyrhla/loader/Normalizer/DefaultXmlNormalizer')
const PreXsdProcessor                  = require('@cyrhla/loader/Processor/PreXsdProcessor')
const XmlSyntaxError                   = require('@cyrhla/loader/Error/XmlSyntaxError')
const ParserForExtensionReferenceError = require('@cyrhla/loader/Error/ParserForExtensionReferenceError')

/**
 * Loads, parses and outputs the data (YAML, JSON, XML) as object.
 *
 * @todo Add the method setParserToExt or addParserToExt (?).
 *
 * @author Krystian Pietruszka <kpietru@cyrhla.com>
 */
module.exports = class Loader
{
    /**
     * Initializes this class with the given options.
     *
     * @param string file
     * @param null|string importsKey Default Loader.IMPORTS_KEY
     * @param object xmlOptions {
     *     @see http://www.npmjs.com/package/xml2js#options
     * }
     */
    constructor(file, importsKey = Loader.IMPORTS_KEY, xmlOptions = {})
    {
        valid(file, 'string')
        valid(importsKey, 'null', 'string')
        valid(xmlOptions, 'object')

        /** @type string */
        this._file = path.normalize(file)

        /** @type string */
        this._dir = path.dirname(this._file)

        /** @type string */
        this._ext = path.extname(file).replace('.', '').toLowerCase()

        /** @type null|string */
        this._importsKey = importsKey

        /** @type object */
        this._xmlOptions = Object.assign({
            explicitRoot:        false,
            attrkey:             Loader.XML_ATTRIBUTE_KEY,
            charkey:             Loader.XML_CHAR_KEY,
            attrValueProcessors: Loader.XML_PROCESORS,
            valueProcessors:     Loader.XML_PROCESORS
        }, xmlOptions)

        /** @type null|function */
        this._xsdValidator = null

        /** @type function[] */
        this._xmlNormalizers = []

        /** @type function[] */
        this._normalizers = []

        /** @type object */
        this._data = {}

        /** @type object Stable extensions and MIME Content-types. */
        this._parserToExt = {
            json: [
                'js', 'json'
            ],
            xml: [
                'atom', 'dtd', 'gpx', 'html', 'kml', 'rdf', 'rss', 'svg', 'vxml',
                'xaml', 'xht', 'xhtml', 'xlf', 'xml', 'xsd', 'xsl', 'xslt'
            ],
            yaml: [
                'yml', 'yaml'
            ]
        }
    }

    /**
     * Gets the key imports.
     *
     * @return string
     */
    static get IMPORTS_KEY()
    {
        return 'imports'
    }

    /**
     * Gets the key attribute.
     *
     * @return string
     */
    static get XML_ATTRIBUTE_KEY()
    {
        return '$'
    }

    /**
     * Gets the key char.
     *
     * @return string
     */
    static get XML_CHAR_KEY()
    {
        return '_'
    }

    /**
     * Gets the XML processors.
     *
     * @return function[]
     */
    static get XML_PROCESORS()
    {
        return [
            Xml2Js.processors.parseNumbers,
            Xml2Js.processors.parseBooleans,
            function(value) {
                if (value === 'null') {
                    return null
                }

                var v = value + ''
                if (v.match(/^\{[\s\S]*.*[\s\S]*\}$|^\[[\s\S]*.*[\s\S]*\]$/)) {
                    return JSON.parse(v)
                }

                return value
            }
        ]
    }

    /**
     * Sets the imports key.
     *
     * @param null|string importsKey
     *
     * @return self The invoked object.
     */
    setImportsKey(importsKey)
    {
        valid(importsKey, 'null', 'string')

        this._importsKey = importsKey

        return this
    }

    /**
     * Gets the imports key.
     *
     * @return null|string
     */
    getImportsKey()
    {
        return this._importsKey
    }

    /**
     * Sets the XML options.
     *
     * @param object xmlOptions {
     *     @see http://www.npmjs.com/package/xml2js#options
     * }
     *
     * @return self The invoked object.
     */
    setXmlOptions(xmlOptions)
    {
        valid(xmlOptions, 'object')

        this._xmlOptions = Object.assign(this.getXmlOptions(), xmlOptions)

        return this
    }

    /**
     * Gets the XML options.
     *
     * @return object.
     */
    getXmlOptions()
    {
        return this._xmlOptions
    }

    /**
     * Sets the XSD validator.
     *
     * @param null|function xsdValidator
     *
     * @return self The invoked object.
     */
    setXsdValidator(xsdValidator)
    {
        valid(xsdValidator, 'null', 'function')

        this._xsdValidator = xsdValidator

        return this
    }

    /**
     * Gets the XSD validator.
     *
     * @return null|function
     */
    getXsdValidator()
    {
        return this._xsdValidator
    }

    /**
     * Adds the XML normalizer.
     *
     * @param function xmlNormalizer
     *
     * @return self The invoked object.
     */
    addXmlNormalizer(xmlNormalizer)
    {
        valid(xmlNormalizer, 'function')

        this._xmlNormalizers.push(xmlNormalizer)

        return this
    }

    /**
     * Gets the XML normalizers.
     *
     * @return function[]
     */
    getXmlNormalizers()
    {
        return this._xmlNormalizers
    }

    /**
     * Adds the normalizer.
     *
     * @param function normalizer
     *
     * @return self The invoked object.
     */
    addNormalizer(normalizer)
    {
        valid(normalizer, 'function')

        this._normalizers.push(normalizer)

        return this
    }

    /**
     * Gets the normalizers.
     *
     * @return function[]
     */
    getNormalizers()
    {
        return this._normalizers
    }

    /**
     * Parses the files and returns an object.
     *
     * @return object
     */
    parseFile()
    {
        this._process()

        return this._data
    }

    /**
     * Loads and parses the file.
     *
     * @throws XmlSyntaxError
     * @throws ParserForExtensionReferenceError
     *
     * @return undefined
     */
    _process()
    {
        var content = fs.readFileSync(this._file) + ''

        if (this._parserToExt['json'].indexOf(this._ext) !== -1) {
            this._data = JSON.parse(content)
            this._nextStep()
        } else if (this._parserToExt['yaml'].indexOf(this._ext) !== -1) {
            this._data = Yaml.parse(content)
            this._nextStep()
        } else if (this._parserToExt['xml'].indexOf(this._ext) !== -1) {

            var self = this
            Xml2Js.parseString(content, this.getXmlOptions(), function (error, result) {
                if (error) {
                    throw new XmlSyntaxError(error.message)
                }

                if (is(self.getXsdValidator(), 'function')) {
                    new PreXsdProcessor(
                        content,
                        result,
                        self.getXmlOptions().attrkey,
                        self._dir,
                        self.getXsdValidator()
                    ).run()
                }

                self._data = result

                Object.assign(
                    self._data,
                    DefaultXmlNormalizer.process(
                        self._data,
                        self.getXmlOptions().attrkey,
                        self.getXmlOptions().charkey,
                        self.getImportsKey()
                    )
                )

                // XML files are normalized before the imports.
                for (let normalizer of self.getXmlNormalizers()) {
                    Object.assign(self._data, normalizer(
                        self._data,
                        self.getXmlOptions().attrkey,
                        self.getXmlOptions().charkey,
                        self.getImportsKey()
                    ))
                }

                self._nextStep()
            })

        } else {
            throw new ParserForExtensionReferenceError(
                'Parser not found for extension "' + this._ext + '".'
            )
        }
    }

    /**
     * Runs the next methods.
     *
     * @return undefined
     */
    _nextStep()
    {
        // Files are normalized before the imports.
        this._normalize()
        this._imports()
    }

    /**
     * Normalizes the object.
     *
     * @return undefined
     */
    _normalize()
    {
        for (let normalizer of this.getNormalizers()) {
            Object.assign(this._data, normalizer(this._data))
        }
    }

    /**
     * Imports the files.
     *
     * @return undefined
     */
    _imports()
    {
        if (this.getImportsKey() !== null && this.getImportsKey() in this._data) {
            let files = this._data[this.getImportsKey()]
            for (let file of files) {
                if (!path.isAbsolute(file)) {
                    file = path.join(this._dir, file)
                }

                file = path.normalize(file)

                var loader = new Loader(file, this.getImportsKey(), this.getXmlOptions())
                    .setImportsKey(this.getImportsKey())
                    .setXmlOptions(this.getXmlOptions())
                    .setXsdValidator(this.getXsdValidator())
                for (let xmlNormalizer of this.getXmlNormalizers()) {
                    loader.addXmlNormalizer(xmlNormalizer)
                }
                for (let normalizer of this.getNormalizers()) {
                    loader.addNormalizer(normalizer)
                }

                var result = loader.parseFile()

                this._data = array_merge_recursive(this._data, result)
            }
        }
    }
}

