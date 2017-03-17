/**
 * @package @cyrhla/loader
 * @license MIT
 * @copyright Krystian Pietruszka <kpietru@cyrhla.com>
 * @see http://www.cyrhla.com
 */

'use strict'

const fs                                    = require('fs')
const Url                                   = require('url').URL
const path                                  = require('path')
const http                                  = require('http')
const valid                                 = require('@cyrhla/tester/valid')
const RequestError                          = require('@cyrhla/loader/Error/RequestError')
const SchemaLocationAttributeReferenceError = require('@cyrhla/loader/Error/SchemaLocationAttributeReferenceError')
const SchemaLocationSyntaxError             = require('@cyrhla/loader/Error/SchemaLocationSyntaxError')

/**
 * Pre-checks the XML and then runs the appropriate processor XSD.
 *
 * @author Krystian Pietruszka <kpietru@cyrhla.com>
 */
module.exports = class PreXsdProcessor
{
    /**
     * Initializes this class with the given options.
     *
     * @param string   xml
     * @param object   parseResult
     * @param string   attrKey
     * @param string   pathToXsdDir
     * @param function xsdValidator
     */
    constructor(xml, parseResult, attrKey, pathToXsdDir, xsdValidator)
    {
        valid(xml, 'string')
        valid(parseResult, 'object')
        valid(attrKey, 'string')
        valid(pathToXsdDir, 'string')
        valid(xsdValidator, 'function')

        /** @type string */
        this._xml = xml

        /** @type object */
        this._parseResult = parseResult

        /** @type string */
        this._attrKey = attrKey

        /** @type string */
        this._pathToXsdDir = pathToXsdDir

        /** @type function */
        this._xsdValidator = xsdValidator
    }

    /**
     * Gets the directory name for XSD schemas.
     *
     * @return string
     */
    static get XSD_SCHEMA_DIR()
    {
        return 'schema'
    }

    /**
     * Runs the processor.
     *
     * @return undefined
     */
    run()
    {
        this._xsdValidatorProcess()
    }

    /**
     * Extracts the first prefix from schemaLocation.
     *
     * @param object attributes
     *
     * @return null|string
     */
    _extractPrefixFromSchemaLocation(attributes)
    {
        valid(attributes, 'object')

        for (let key in attributes) {
            var prefix = key.match(/([^:]+):schemaLocation$/)
            if (prefix) {
                return prefix[1]
            }
        }

        return null
    }

    /**
     * Formats the schemaLocation to the array.
     *
     * @param string schemaLocation
     *
     * @return array
     */
    _formatSchemaLocationToArray(schemaLocation)
    {
        valid(schemaLocation, 'string')

        return schemaLocation.replace(/\r?\n|\r/g, ' ')
            .split(' ')
            .filter(function(value) {
                if (value.trim()) {
                    return value
                }
            })
            .filter(function(value, i) {
                if (i % 2) {
                    return value
                }
            })
    }

    /**
     * Validates the XML.
     *
     * @throws SchemaLocationAttributeReferenceError
     * @throws SchemaLocationSyntaxError
     * @throws RequestError
     *
     * @return undefined
     */
    _xsdValidatorProcess()
    {
        var attributes = {}
        if (this._attrKey in this._parseResult) {
            var attributes = this._parseResult[this._attrKey]
        }

        var prefix = this._extractPrefixFromSchemaLocation(attributes)

        if ((this._attrKey in this._parseResult) === false || prefix === null) {
            throw new SchemaLocationAttributeReferenceError(
                '@param ...:schemaLocation attribute is not defined.'
            )
        }

        var schemaLocation = this._parseResult[this._attrKey][prefix + ':schemaLocation']
        var xsdFiles = this._formatSchemaLocationToArray(schemaLocation)

        if (xsdFiles.length === 0) {
            throw new SchemaLocationSyntaxError(
                '@param ' + prefix + ':schemaLocation attribute - XSD file is not defined.'
            )
        }

        for (let xsdFile of xsdFiles) {

            if (!xsdFile.match(/^http:/)) {
                this._xsdLocal(xsdFile)
                continue
            }

            var url = new Url(xsdFile)

            // First, checks the local file.
            var file = path.join(this._pathToXsdDir, path.basename(url.pathname))
            if (fs.existsSync(file)) {
                this._xsdLocal(file)
                continue
            }

            // Second, checks the local file inside the directory "schema".
            var file = path.join(this._pathToXsdDir, PreXsdProcessor.XSD_SCHEMA_DIR, path.basename(url.pathname))
            if (fs.existsSync(file)) {
                this._xsdLocal(file)
                continue
            }

            var self = this
            http.get(url.toString(), function(response) {

                if (response.statusCode !== 200 && response.statusCode !== 301) {
                    throw new RequestError('Request failed, status code: ' + response.statusCode + '.')
                }

                response.setEncoding('utf8')

                var xsd = ''
                response.on('data', function(chunk) {
                    xsd += chunk
                })

                response.on('end', function() {
                    self._xsdValidator(xsd, self._xml)
                })

            })
        }
    }

    /**
     * Validates the XML locally.
     *
     * @param string xsdFile
     *
     * @return undefined
     */
    _xsdLocal(xsdFile)
    {
        valid(xsdFile, 'string')

        if (!path.isAbsolute(xsdFile)) {
            xsdFile = path.join(this._pathToXsdDir, xsdFile)
        }

        var xsd = fs.readFileSync(path.normalize(xsdFile)) + ''
        this._xsdValidator(xsd, this._xml)
    }
}

