/**
 * @package @cyrhla/loader
 * @license MIT
 * @copyright Krystian Pietruszka <kpietru@cyrhla.com>
 * @see http://www.cyrhla.com
 */

'use strict'

const Tester               = require('@cyrhla/tester/Tester')
const DefaultXmlNormalizer = require('../../Normalizer/DefaultXmlNormalizer')

/**
 * DefaultXmlNormalizerTest
 *
 * @author Krystian Pietruszka <kpietru@cyrhla.com>
 */
module.exports = class DefaultXmlNormalizerTest extends Tester
{
    before()
    {
        this.obj = {}
        this.attrKey = '$'
        this.charKey = '_'
        this.importsKey = 'imports'

        this.parseObj = {
            "$": {
                "xmlns": "http://www.cyrhla.com/2017/schema/container",
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "xsi:schemaLocation": "http://www.cyrhla.com/2017/schema/container http://www.cyrhla.com/2017/schema/container-0.0.1.xsd"
            },
            "imports":[
                {
                    "import":[
                        {
                            "$":{
                                "resource": "data2.yml"
                            }
                        },
                        {
                            "$":{
                                "resource": "data3.json"
                            }
                        }
                    ]
                }
            ]
        }

        this.parseObjWithoutResourceAttribute = {
            "$": {
                "xmlns": "http://www.cyrhla.com/2017/schema/container",
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "xsi:schemaLocation": "http://www.cyrhla.com/2017/schema/container http://www.cyrhla.com/2017/schema/container-0.0.1.xsd"
            },
            "imports":[
                {
                    "import":[
                        {
                            "$":{
                                "resource": "data2.yml"
                            }
                        },
                        {
                            "$":{
                                "resourceeeeeeeeeeeeeeeeeeeeeeeeeee": "data3.json"
                            }
                        }
                    ]
                }
            ]
        }
    }

    testProcessArgumentInvalidTypeError()
    {
        var self = this

        // Invalid obj.
        var args = ['', 0, null, false, Object, Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                DefaultXmlNormalizer.process(arg, self.attrKey, self.attrKey, self.importsKey)
            }, index)
        }

        // Invalid attrKey.
        var args = [0, null, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                DefaultXmlNormalizer.process(self.obj, arg, self.charKey, self.importsKey)
            }, index)
        }

        // Invalid charKey.
        var args = [0, null, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                DefaultXmlNormalizer.process(self.obj, self.attrKey, arg, self.importsKey)
            }, index)
        }

        // Invalid importsKey.
        var args = [0, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                DefaultXmlNormalizer.process(self.obj, self.attrKey, self.charKey, arg)
            }, index)
        }
    }

    testProcessResourceAttributeReferenceError()
    {
        var self = this

        this.assertError('ResourceAttributeReferenceError', function() {
            DefaultXmlNormalizer.process(self.parseObjWithoutResourceAttribute, self.attrKey, self.charKey, self.importsKey)
        })
    }

    testProcessReturnsObject()
    {
        var result = DefaultXmlNormalizer.process(this.parseObj, this.attrKey, this.charKey, this.importsKey)
        this.assertSame({imports:['data2.yml','data3.json']}, result)

        var result = DefaultXmlNormalizer.process(this.parseObj, this.attrKey, this.charKey, null)
        this.assertSame({}, result)
    }
}

