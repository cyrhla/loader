/**
 * @package @cyrhla/loader
 * @license MIT
 * @copyright Krystian Pietruszka <kpietru@cyrhla.com>
 * @see http://www.cyrhla.com
 */

'use strict'

const fs              = require('fs')
const path            = require('path')
const Tester          = require('@cyrhla/tester/Tester')
const PreXsdProcessor = require('../../Processor/PreXsdProcessor')

/**
 * PreXsdProcessorTest
 *
 * @todo test_xsdValidatorProcessRequestError
 *
 * @author Krystian Pietruszka <kpietru@cyrhla.com>
 */
module.exports = class PreXsdProcessorTest extends Tester
{
    before()
    {
        this.xml = fs.readFileSync(path.join(__dirname, '/fixtures/container.xml')) + ''
        this.attrKey = '$'
        this.pathToXsdDir = path.join(__dirname, '/fixtures/schema')
        this.xsdValidator = function(xsd, xml) {}

        this.parseResult = {
            "$": {
                "xmlns": "http://www.cyrhla.com/2017/schema/container",
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "xsi:schemaLocation": "http://www.cyrhla.com/2017/schema/container http://www.cyrhla.com/2017/schema/container-1.0.xsd"
            },
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
                            "call": [
                                {
                                    "$": {
                                        "method": "someMethod"
                                    },
                                    "arguments": [
                                        {
                                            "argument": [
                                                -0.1
                                            ]
                                        }
                                    ],
                                    "argument": [
                                        "undefined"
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
            ]
        }

        this.parseResultWithoutSchemaLocation = {
            "$": {
                "xmlns": "http://www.cyrhla.com/2017/schema/container",
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
            },
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
                            "call": [
                                {
                                    "$": {
                                        "method": "someMethod"
                                    },
                                    "arguments": [
                                        {
                                            "argument": [
                                                -0.1
                                            ]
                                        }
                                    ],
                                    "argument": [
                                        "undefined"
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
            ]
        }

        this.parseResultWithSchemaSyntaxError = {
            "$": {
                "xmlns": "http://www.cyrhla.com/2017/schema/container",
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "xsi:schemaLocation": "http://www.cyrhla.com/2017/schema/container"
            },
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
                            "call": [
                                {
                                    "$": {
                                        "method": "someMethod"
                                    },
                                    "arguments": [
                                        {
                                            "argument": [
                                                -0.1
                                            ]
                                        }
                                    ],
                                    "argument": [
                                        "undefined"
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
            ]
        }
    }

    testInstanceOf()
    {
        var preXsdProcessor = new PreXsdProcessor(this.xml, this.parseResult, this.attrKey, this.pathToXsdDir, this.xsdValidator)

        this.assertInstanceOf(PreXsdProcessor, preXsdProcessor)
    }

    testContructorArgumentInvalidTypeError()
    {
        var self = this

        // Invalid xml.
        var args = [0, null, false, Object, Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                new PreXsdProcessor(arg, self.parseObj, self.attrKey, self.pathToXsdDir, self.xsdValidator)
            }, index)
        }

        // Invalid parseResult.
        var args = ['', 0, null, false, Object, Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                new PreXsdProcessor(self.xml, arg, self.attrKey, self.pathToXsdDir, self.xsdValidator)
            }, index)
        }

        // Invalid attrKey.
        var args = [0, null, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                new PreXsdProcessor(self.xml, self.parseObj, arg, self.pathToXsdDir, self.xsdValidator)
            }, index)
        }

        // Invalid pathToXsdDir.
        var args = [0, null, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                new PreXsdProcessor(self.xml, self.parseObj, self.attrKey, arg, self.xsdValidator)
            }, index)
        }

        // Invalid xsdValidator.
        var args = ['', 0, null, false, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                new PreXsdProcessor(self.xml, self.parseObj, self.attrKey, self.pathToXsdDir, arg)
            }, index)
        }
    }

    testGetXSD_SCHEMA_DIRReturnsString()
    {
        this.assertSame('schema', PreXsdProcessor.XSD_SCHEMA_DIR)
    }

    testRunSyntaxError()
    {
        var xsdValidator = function(xsd, xml) {
            throw new SyntaxError()
        }
        var preXsdProcessor = new PreXsdProcessor(this.xml, this.parseResult, this.attrKey, this.pathToXsdDir, xsdValidator)

        this.expectError('SyntaxError', function() {
            preXsdProcessor.run()
        })
    }

    testRunReturnsUndefined()
    {
        var preXsdProcessor = new PreXsdProcessor(this.xml, this.parseResult, this.attrKey, this.pathToXsdDir, this.xsdValidator)

        this.assertSame(undefined, preXsdProcessor.run())
    }

    test_extractPrefixFromSchemaLocationArgumentInvalidTypeError()
    {
        var self = this
        var preXsdProcessor = new PreXsdProcessor(this.xml, this.parseResult, this.attrKey, this.pathToXsdDir, this.xsdValidator)

        // Invalid attributes.
        var args = ['', 0, null, false, Object, Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                preXsdProcessor._extractPrefixFromSchemaLocation(arg)
            }, index)
        }
    }

    test_extractPrefixFromSchemaLocationReturnsNullOrString()
    {
        var preXsdProcessor = new PreXsdProcessor(this.xml, this.parseResult, this.attrKey, this.pathToXsdDir, this.xsdValidator)

        var obj = {
            "xmlns": "http://www.cyrhla.com/2017/schema/container",
            "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
        }
        this.assertSame(null, preXsdProcessor._extractPrefixFromSchemaLocation(obj))

        var obj = {
            "xmlns": "http://www.cyrhla.com/2017/schema/container",
            "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "xsi:schemaLocation": "http://www.cyrhla.com/2017/schema/container container-1.0.xsd"
        }
        this.assertSame('xsi', preXsdProcessor._extractPrefixFromSchemaLocation(obj))

        var obj = {
            "xmlns": "http://www.cyrhla.com/2017/schema/container",
            "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "xxx:schemaLocation": "http://www.cyrhla.com/2017/schema/container container-1.0.xsd",
            "xsi:schemaLocation": "http://www.cyrhla.com/2017/schema/container container-1.0.xsd"
        }
        this.assertSame('xxx', preXsdProcessor._extractPrefixFromSchemaLocation(obj))
    }

    test_formatSchemaLocationToArrayArgumentInvalidTypeError()
    {
        var self = this
        var preXsdProcessor = new PreXsdProcessor(this.xml, this.parseResult, this.attrKey, this.pathToXsdDir, this.xsdValidator)

        // Invalid schemaLocation.
        var args = [0, null, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                preXsdProcessor._formatSchemaLocationToArray(arg)
            }, index)
        }
    }

    test_formatSchemaLocationToArrayReturnsArray()
    {
        var preXsdProcessor = new PreXsdProcessor(this.xml, this.parseResult, this.attrKey, this.pathToXsdDir, this.xsdValidator)

        var obj = {
            "xmlns": "http://www.cyrhla.com/2017/schema/container",
            "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "xsi:schemaLocation": "http://www.cyrhla.com/2017/schema/container container-1.0.xsd"
        }
        this.assertSame(['container-1.0.xsd'], preXsdProcessor._formatSchemaLocationToArray(obj['xsi:schemaLocation']))

        var obj = {
            "xmlns": "http://www.cyrhla.com/2017/schema/container",
            "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "xsi:schemaLocation": "http://www.cyrhla.com/2017/schema/container http://www.example.com/container-1.0.xsd"
        }
        this.assertSame(['http://www.example.com/container-1.0.xsd'], preXsdProcessor._formatSchemaLocationToArray(obj['xsi:schemaLocation']))

        var obj = {
            "xmlns": "http://www.cyrhla.com/2017/schema/container",
            "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "xsi:schemaLocation": "http://www.cyrhla.com/2017/schema/container container-1.0.xsd http://www.cyrhla.com/2017/schema/container http://www.example.com/container-1.0.xsd"
        }
        this.assertSame(['container-1.0.xsd', 'http://www.example.com/container-1.0.xsd'], preXsdProcessor._formatSchemaLocationToArray(obj['xsi:schemaLocation']))

        var obj = {
            "xmlns": "http://www.cyrhla.com/2017/schema/container",
            "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
            "xsi:schemaLocation": "\n\rhttp://www.cyrhla.com/2017/schema/container\n \n  container-1.0.xsd \n \r\nhttp://www.cyrhla.com/2017/schema/container\rhttp://www.example.com/container-1.0.xsd\r\n\n\r"
        }
        this.assertSame(['container-1.0.xsd', 'http://www.example.com/container-1.0.xsd'], preXsdProcessor._formatSchemaLocationToArray(obj['xsi:schemaLocation']))
    }

    test_xsdValidatorProcessSchemaLocationAttributeReferenceError()
    {
        var preXsdProcessor = new PreXsdProcessor(this.xml, this.parseResultWithoutSchemaLocation, this.attrKey, this.pathToXsdDir, this.xsdValidator)

        this.expectError('SchemaLocationAttributeReferenceError', function() {
            preXsdProcessor._xsdValidatorProcess()
        })
    }

    test_xsdValidatorProcessSchemaLocationSyntaxError()
    {
        var preXsdProcessor = new PreXsdProcessor(this.xml, this.parseResultWithSchemaSyntaxError, this.attrKey, this.pathToXsdDir, this.xsdValidator)

        this.expectError('SchemaLocationSyntaxError', function() {
            preXsdProcessor._xsdValidatorProcess()
        })
    }

    test_xsdValidatorProcessRequestError()
    {
        // Complicated because http.get is invoked asynchronously.
    }

    test_xsdValidatorProcessReturnsUndefined()
    {
        var preXsdProcessor = new PreXsdProcessor(this.xml, this.parseResult, this.attrKey, this.pathToXsdDir, this.xsdValidator)

        this.assertSame(undefined, preXsdProcessor._xsdValidatorProcess())
    }

    test_xsdLocalArgumentInvalidTypeError()
    {
        var self = this
        var preXsdProcessor = new PreXsdProcessor(this.xml, this.parseResult, this.attrKey, this.pathToXsdDir, this.xsdValidator)

        // Invalid xsdFile.
        var args = [0, null, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                preXsdProcessor._xsdLocal(arg)
            }, index)
        }
    }

    test_xsdLocalReturnsUndefinedooo()
    {
        var preXsdProcessor = new PreXsdProcessor(this.xml, this.parseResult, this.attrKey, this.pathToXsdDir, this.xsdValidator)

        this.expectError('Error', function() {
            preXsdProcessor._xsdLocal('llllllllllllllllllll')
        })
    }

    test_xsdLocalReturnsUndefined()
    {
        var preXsdProcessor = new PreXsdProcessor(this.xml, this.parseResult, this.attrKey, this.pathToXsdDir, this.xsdValidator)

        this.assertSame(undefined, preXsdProcessor._xsdLocal(path.join(__dirname, '/fixtures/schema', '/container-1.0.xsd')))
    }
}

