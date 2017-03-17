/**
 * @package @cyrhla/loader
 * @license MIT
 * @copyright Krystian Pietruszka <kpietru@cyrhla.com>
 * @see http://www.cyrhla.com
 */

'use strict'

const path   = require('path')
const Tester = require('@cyrhla/tester/Tester')
const Loader = require('../Loader')

/**
 * LoaderTest
 *
 * @author Krystian Pietruszka <kpietru@cyrhla.com>
 */
module.exports = class LoaderTest extends Tester
{
    testInstanceOf()
    {
        var loader = new Loader(path.join(__dirname, '/fixtures/data.yml'))

        this.assertInstanceOf(Loader, loader)
    }

    testContructorArgumentInvalidTypeError()
    {
        // Invalid file.
        var args = [0, null, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                new Loader(arg)
            }, index)
        }

        // Invalid importKey.
        var args = [0, false, Object, new Object(), Symbol('foo'), /^/, []]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                new Loader('', arg)
            }, index)
        }

        // Invalid xmlOptions.
        var args = ['', 0, null, false, Object, Symbol('foo'), /^/, []]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                new Loader('', '', arg)
            }, index)
        }
    }

    testGetIMPORTS_KEYReturnsString()
    {
        this.assertSame('imports', Loader.IMPORTS_KEY)
    }

    testGetXML_ATTRIBUTE_KEYReturnsString()
    {
        this.assertSame('$', Loader.XML_ATTRIBUTE_KEY)
    }

    testGetXML_CHAR_KEYReturnsString()
    {
        this.assertSame('_', Loader.XML_CHAR_KEY)
    }

    testGetXML_PROCESORSReturnsArray()
    {
        this.assertType('array', Loader.XML_PROCESORS)
        this.assertType('function', Loader.XML_PROCESORS[0])
        this.assertType('function', Loader.XML_PROCESORS[1])
        this.assertType('function', Loader.XML_PROCESORS[2])
        this.assertType('undefined', Loader.XML_PROCESORS[3])
    }

    testSetImportsKeyArgumentInvalidTypeError()
    {
        var loader = new Loader(path.join(__dirname, '/fixtures/data.yml'))

        // Invalid importKey.
        var args = [0, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                loader.setImportsKey(arg)
            }, index)
        }
    }

    testSetImportsKeyReturnsSelf()
    {
        var loader = new Loader(path.join(__dirname, '/fixtures/data.yml'))

        this.assertInstanceOf(Loader, loader.setImportsKey(null))
        this.assertInstanceOf(Loader, loader.setImportsKey('imports'))
    }

    testGetImportsKeyReturnsNullOrString()
    {
        var loader = new Loader(path.join(__dirname, '/fixtures/data.yml'), '--imports--')

        this.assertSame('--imports--', loader.getImportsKey())

        loader.setImportsKey(null)
        this.assertSame(null, loader.getImportsKey())

        loader.setImportsKey('')
        this.assertSame('', loader.getImportsKey())
    }

    testSetXmlOptionsArgumentInvalidTypeError()
    {
        var loader = new Loader(path.join(__dirname, '/fixtures/data.yml'))

        // Invalid xmlOptions.
        var args = [0, null, false, Object, Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                loader.setXmlOptions(arg)
            }, index)
        }
    }

    testSetXmlOptionsReturnsSelf()
    {
        var loader = new Loader(path.join(__dirname, '/fixtures/data.yml'))

        this.assertInstanceOf(Loader, loader.setXmlOptions({}))
    }

    testGetXmlOptionsReturnsObject()
    {
        var loader = new Loader(path.join(__dirname, '/fixtures/data.yml'))

        this.assertSame('$', loader.getXmlOptions().attrkey)
        this.assertSame(false, loader.getXmlOptions().explicitRoot)

        this.assertType('array', loader.getXmlOptions().attrValueProcessors)

        this.assertType('function', loader.getXmlOptions().attrValueProcessors[0])
        this.assertType('function', loader.getXmlOptions().attrValueProcessors[1])
        this.assertType('function', loader.getXmlOptions().attrValueProcessors[2])
        this.assertType('undefined', loader.getXmlOptions().attrValueProcessors[3])

        this.assertType('function', loader.getXmlOptions().valueProcessors[0])
        this.assertType('function', loader.getXmlOptions().valueProcessors[1])
        this.assertType('function', loader.getXmlOptions().valueProcessors[2])
        this.assertType('undefined', loader.getXmlOptions().valueProcessors[3])

        loader.setXmlOptions({
            explicitRoot: false,
            attrValueProcessors: null
        })
        loader.setXmlOptions({
            explicitRoot: true,
            valueProcessors: null
        })
        var expected = {
            explicitRoot: true,
            attrkey: '$',
            charkey: '_',
            attrValueProcessors: null,
            valueProcessors: null
        }
        this.assertSame(expected, loader.getXmlOptions())
    }


    testSetXsdValidatorArgumentInvalidTypeError()
    {
        var loader = new Loader(path.join(__dirname, '/fixtures/data.yml'))

        // Invalid xsdValidator.
        var args = ['', 0, false, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                loader.setXsdValidator(arg)
            }, index)
        }
    }

    testSetXsdValidatorReturnsSelf()
    {
        var loader = new Loader(path.join(__dirname, '/fixtures/data.yml'))

        this.assertInstanceOf(Loader, loader.setXsdValidator(null))
        this.assertInstanceOf(Loader, loader.setXsdValidator(function(xsd, xml) {}))
    }

    testGetXsdValidatorReturnsNullOrFunction()
    {
        var loader = new Loader(path.join(__dirname, '/fixtures/data.yml'))

        this.assertSame(null, loader.getXsdValidator())

        loader.setXsdValidator(function(xsd, xml) {
            return xsd + xml + 123
        })
        this.assertSame('ab123', loader.getXsdValidator()('a', 'b'))
    }

    testAddXmlNormalizerArgumentInvalidTypeError()
    {
        var loader = new Loader(path.join(__dirname, '/fixtures/data.yml'))

        // Invalid xmlNormalizer.
        var args = ['', 0, null, false, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                loader.addXmlNormalizer(arg)
            }, index)
        }
    }

    testAddXmlNormalizerReturnsSelf()
    {
        var loader = new Loader(path.join(__dirname, '/fixtures/data.yml'))

        this.assertInstanceOf(Loader, loader.addXmlNormalizer(function(data) {}))
    }

    testGetXmlNromalizersReturnsArray()
    {
        var loader = new Loader(path.join(__dirname, '/fixtures/data.yml'))

        this.assertType('array', loader.getXmlNormalizers())

        loader.addXmlNormalizer(function(data) {})
        this.assertSame([function(data) {}], loader.getXmlNormalizers())

        loader.addXmlNormalizer(function(data) {
            return data + 123
        })
        this.assertSame('abc123', loader.getXmlNormalizers()[1]('abc'))
    }

    testAddNormalizerArgumentInvalidTypeError()
    {
        var loader = new Loader(path.join(__dirname, '/fixtures/data.yml'))

        // Invalid normalizer.
        var args = ['', 0, null, false, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                loader.addNormalizer(arg)
            }, index)
        }
    }

    testAddNormalizerReturnsSelf()
    {
        var loader = new Loader(path.join(__dirname, '/fixtures/data.yml'))

        this.assertInstanceOf(Loader, loader.addNormalizer(function(data) {}))
    }

    testGetNromalizersReturnsArray()
    {
        var loader = new Loader(path.join(__dirname, '/fixtures/data.yml'))

        this.assertType('array', loader.getNormalizers())

        loader.addNormalizer(function(data) {})
        this.assertSame([function(data) {}], loader.getNormalizers())

        loader.addNormalizer(function(data) {
            return data + 123
        })
        this.assertSame('abc123', loader.getNormalizers()[1]('abc'))
    }

    testParseFileNoSuchFileError()
    {
        this.assertError('Error', function() {
            new Loader('lllllllllllllllll').parseFile()
        })
    }

    testParseFileJsonSyntaxError()
    {
        this.assertError('SyntaxError', function() {
            new Loader(path.join(__dirname, '/fixtures/invalid/invalid.json')).parseFile()
        })
    }

    testParseFileYamlParseException()
    {
        this.assertError('ParseException', function() {
            new Loader(path.join(__dirname, '/fixtures/invalid/invalid.yml')).parseFile()
        })
    }

    testParseFileXmlSyntaxError()
    {
        this.assertError('XmlSyntaxError', function() {
            new Loader(path.join(__dirname, '/fixtures/invalid/invalid.xml')).parseFile()
        })
    }

    testParseFileExtensionParserNotFoundReferenceError()
    {
        this.assertError('ParserForExtensionReferenceError', function() {
            new Loader(path.join(__dirname, '/fixtures/invalid/invalid.extension')).parseFile()
        })
    }

    testSchemaLocationAttributeReferenceError()
    {
        this.assertError('SchemaLocationAttributeReferenceError', function() {
            new Loader(path.join(__dirname, '/fixtures/data2.xml'))
                .setXsdValidator(function(xsd, xml) {})
                .parseFile()
        })
    }

    testSchemaLocationSyntaxError()
    {
        this.assertError('SchemaLocationSyntaxError', function() {
            new Loader(path.join(__dirname, '/fixtures/invalid/invalid-schema-location.xml'))
                .setXsdValidator(function(xsd, xml) {})
                .parseFile()
        })
    }

    testParseFileReturnsObject()
    {
        var expected = {
            "imports": [
                "data1.json",
                "data2.xml",
                "data3.json"
            ],
            "foo": 1,
            "bar": [
                true,
                false,
                true,
                false
            ],
            "baz": {
                "a": -3.14,
                "b": null,
                "c": " ",
                "d": "\"Żółć\" ",
                "e": []
            },
            "fooXml": [
                {
                    "$": {
                        "id": "_123",
                        "class": "abc",
                        "data-number": -0.1,
                        "data-boolean": true,
                        "data-null": null
                    },
                    "arguments": [
                        {
                            "argument": [
                                0,
                                3.14,
                                null,
                                null,
                                true,
                                false,
                                "\"Żółć\"\n abc"
                            ]
                        },
                        {
                            "argument": [
                                "",
                                " "
                            ]
                        }
                    ]
                }
            ]
        }
        var loader = new Loader(path.join(__dirname, '/fixtures/data.yml'))
        this.assertSame(expected, loader.parseFile())

        var expected = {imports:['data1.json']}
        var loader = new Loader(path.join(__dirname, '/fixtures/data.yml'), null)
        this.assertSame(expected, loader.parseFile())

        var expected = {
            "imports": [
                "data1.json",
                "data2.xml"
            ],
            "foo": 1,
            "bar": [
                true,
                false
            ],
            "baz": {
                "a": -3.14,
                "b": null,
                "c": " ",
                "d": "\"Żółć\" ",
                "e": []
            },
            "root": {
                "imports": [
                    {
                        "import": [
                            {
                                "$": {
                                    "resource": "data3.json"
                                }
                            }
                        ]
                    }
                ],
                "fooXml": [
                    {
                        "$": {
                            "id": "_123",
                            "class": "abc",
                            "data-number": -0.1,
                            "data-boolean": true,
                            "data-null": null
                        },
                        "arguments": [
                            {
                                "argument": [
                                    0,
                                    3.14,
                                    null,
                                    null,
                                    true,
                                    false,
                                    "\"Żółć\"\n abc"
                                ]
                            },
                            {
                                "argument": [
                                    "",
                                    " "
                                ]
                            }
                        ]
                    }
                ]
            }
        }
        var xmlOptions = {
            explicitRoot: true
        }
        var loader = new Loader(path.join(__dirname, '/fixtures/data.yml'), 'imports', xmlOptions)
        this.assertSame(expected, loader.parseFile())

        var expected = {
            "imports": [
                "data1.json",
                "data2.xml"
            ],
            "foo": 1,
            "bar": [
                true,
                false
            ],
            "baz": {
                "a": -3.14,
                "b": null,
                "c": " ",
                "d": "\"Żółć\" ",
                "e": []
            },
            "root": {
                "imports": [
                    {
                        "import": [
                            {
                                "$": {
                                    "resource": "data3.json"
                                }
                            }
                        ]
                    }
                ],
                "fooXml": [
                    {
                        "$": {
                            "id": "_123",
                            "class": "abc",
                            "data-number": "-.1",
                            "data-boolean": "true",
                            "data-null": "null"
                        },
                        "arguments": [
                            {
                                "argument": [
                                    "0",
                                    "3.14",
                                    ".0",
                                    "null",
                                    "true",
                                    "false",
                                    "\"Żółć\"\n abc"
                                ]
                            },
                            {
                                "argument": [
                                    "",
                                    " "
                                ]
                            }
                        ]
                    }
                ]
            }
        }
        var xmlOptions = {
            explicitRoot: true,
            attrValueProcessors: null,
            valueProcessors: null
        }
        var loader = new Loader(path.join(__dirname, '/fixtures/data.yml'), 'imports', xmlOptions)
        this.assertSame(expected, loader.parseFile())

        var expected = {
            "imports": [
                "black.json"
            ],
            "black": 123
        }
        var loader = new Loader(path.join(__dirname, '/fixtures/White space/white.yml'))
        this.assertSame(expected, loader.parseFile())

        var expected = {
            "imports": [
                "black.json"
            ]
        }
        var loader = new Loader(path.join(__dirname, '/fixtures/White space/white.yml'), null)
        this.assertSame(expected, loader.parseFile())

        var expected = {
            "$": {
                "xmlns": "http://www.cyrhla.com/2017/schema/translator",
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "xsi:schemaLocation": "http://www.cyrhla.com/2017/schema/translator http://www.cyrhla.com/2017/schema/translator-1.0.xsd"
            },
            "imports": [
                "translator.xml",
                "data3.json",
                "data3.json"
            ],
            "parameters": [
                {
                    "parameter": [
                        {
                            "$": {
                                "id": "foo"
                            }
                        },
                        {
                            "_": -0.1,
                            "$": {
                                "id": "bar"
                            }
                        },
                        {
                            "_": 0,
                            "$": {
                                "id": "baz"
                            }
                        },
                        {
                            "_": "false ",
                            "$": {
                                "id": null
                            }
                        },
                        {
                            "_": " []",
                            "$": {
                                "id": " {}"
                            }
                        },
                        {
                            "_": [],
                            "$": {
                                "id": {}
                            }
                        },
                        {
                            "_": {
                                "foo": null,
                                "bar": "baz"
                            },
                            "$": {
                                "id": [
                                    0,
                                    false
                                ]
                            }
                        }
                    ]
                }
            ],
            "services": [
                {
                    "service": [
                        {
                            "$": {
                                "id": "bar",
                                "alias": "żółć",
                                "class": null,
                                "public": true
                            },
                            "arguments": [
                                {
                                    "argument": [
                                        "arg1",
                                        "arg2"
                                    ]
                                }
                            ],
                            "argument": [
                                "arg3"
                            ],
                            "call": [
                                {
                                    "$": {
                                        "method": "someMethod"
                                    },
                                    "arguments": [
                                        {
                                            "argument": [
                                                "a1",
                                                "a2"
                                            ]
                                        }
                                    ],
                                    "argument": [
                                        "a3"
                                    ]
                                }
                            ],
                            "tags": [
                                {
                                    "tag": [
                                        "tag1",
                                        "tag2"
                                    ]
                                }
                            ],
                            "tag": [
                                "tag3"
                            ]
                        },
                        {
                            "$": {
                                "id": "baz",
                                "class": "@some/module/Class",
                                "public": false
                            },
                            "arguments": [
                                {
                                    "argument": [
                                        "",
                                        " "
                                    ]
                                }
                            ],
                            "argument": [
                                " żółć "
                            ],
                            "calls": [
                                {
                                    "call": [
                                        {
                                            "$": {
                                                "method": "someMethod"
                                            },
                                            "arguments": [
                                                {
                                                    "argument": [
                                                        9,
                                                        999999999999999,
                                                        10000000000000000,
                                                        9.999999999999998,
                                                        1e+21
                                                    ]
                                                }
                                            ],
                                            "argument": [
                                                "undefined"
                                            ]
                                        }
                                    ]
                                }
                            ],
                            "tags": [
                                {
                                    "tag": [
                                        "tag1",
                                        "tag2"
                                    ]
                                }
                            ],
                            "tag": [
                                "tag3\n"
                            ]
                        }
                    ]
                }
            ],
            "translations": [
                {
                    "translation": [
                        {
                            "$": {
                                "id": "blog.HELLO"
                            },
                            "text": [
                                {
                                    "_": "Hello",
                                    "$": {
                                        "lang": "en"
                                    }
                                },
                                {
                                    "_": "Halo",
                                    "$": {
                                        "lang": "de"
                                    }
                                },
                                {
                                    "_": "Bnjour",
                                    "$": {
                                        "lang": "fr"
                                    }
                                },
                                {
                                    "_": "Cześć",
                                    "$": {
                                        "lang": "pl"
                                    }
                                }
                            ]
                        },
                        {
                            "$": {
                                "id": "blog.GREEN"
                            },
                            "text": [
                                {
                                    "_": "green",
                                    "$": {
                                        "lang": "en"
                                    }
                                },
                                {
                                    "_": "grün",
                                    "$": {
                                        "lang": "de"
                                    }
                                },
                                {
                                    "_": "vert",
                                    "$": {
                                        "lang": "fr"
                                    }
                                },
                                {
                                    "_": "zielony",
                                    "$": {
                                        "lang": "pl"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ],
            "foo": 1,
            "bar": [
                true,
                false,
                true,
                false
            ],
            "baz": {
                "a": -3.14,
                "b": null,
                "c": " ",
                "d": "\"Żółć\" ",
                "e": []
            }
        }
        var loader = new Loader(path.join(__dirname, '/fixtures/container.xml'))
        this.assertSame(expected, loader.parseFile())
    }
}
