/**
 * @package @cyrhla/loader
 * @license MIT
 * @copyright Krystian Pietruszka <kpietru@cyrhla.com>
 * @see http://www.cyrhla.com
 */

'use strict'

const Tester                  = require('@cyrhla/tester/Tester')
const TranslatorXmlNormalizer = require('../../Normalizer/TranslatorXmlNormalizer')

/**
 * TranslatorXmlNormalizerTest
 *
 * @author Krystian Pietruszka <kpietru@cyrhla.com>
 */
module.exports = class TranslatorXmlNormalizerTest extends Tester
{
    before()
    {
        this.obj = {}
        this.attrKey = '$'
        this.charKey = '_'

        this.parseObj = {
            "$": {
                "xmlns": "http://www.cyrhla.com/2017/schema/translator",
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "xsi:schemaLocation": "http://www.cyrhla.com/2017/schema/translator http://www.cyrhla.com/2017/schema/translator-1.0.xsd"
            },
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
            ]
        }

        this.parseObjWithoutIdAttribute = {
            "$": {
                "xmlns": "http://www.cyrhla.com/2017/schema/translator",
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "xsi:schemaLocation": "http://www.cyrhla.com/2017/schema/translator http://www.cyrhla.com/2017/schema/translator-1.0.xsd"
            },
            "translations": [
                {
                    "translation": [
                        {
                            "$": {
                                "iddddddddddddddddddddddddddddddd": "blog.HELLO"
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
            ]
        }

        this.parseObjWithoutLangAttribute = {
            "$": {
                "xmlns": "http://www.cyrhla.com/2017/schema/translator",
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "xsi:schemaLocation": "http://www.cyrhla.com/2017/schema/translator http://www.cyrhla.com/2017/schema/translator-1.0.xsd"
            },
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
                                        "langgggggggggggggggggggggggggggg": "fr"
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
            ]
        }

        this.parseObjWithCustomKeysAttributes = {
            "@": {
                "xmlns": "http://www.cyrhla.com/2017/schema/translator",
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "xsi:schemaLocation": "http://www.cyrhla.com/2017/schema/translator http://www.cyrhla.com/2017/schema/translator-1.0.xsd"
            },
            "translations": [
                {
                    "translation": [
                        {
                            "@": {
                                "id": "blog.HELLO"
                            },
                            "text": [
                                {
                                    "=": "Hello",
                                    "@": {
                                        "lang": "en"
                                    }
                                },
                                {
                                    "=": "Halo",
                                    "@": {
                                        "lang": "de"
                                    }
                                },
                                {
                                    "=": "Bnjour",
                                    "@": {
                                        "lang": "fr"
                                    }
                                },
                                {
                                    "=": "Cześć",
                                    "@": {
                                        "lang": "pl"
                                    }
                                }
                            ]
                        },
                        {
                            "@": {
                                "id": "blog.GREEN"
                            },
                            "text": [
                                {
                                    "=": "green",
                                    "@": {
                                        "lang": "en"
                                    }
                                },
                                {
                                    "=": "grün",
                                    "@": {
                                        "lang": "de"
                                    }
                                },
                                {
                                    "=": "vert",
                                    "@": {
                                        "lang": "fr"
                                    }
                                },
                                {
                                    "=": "zielony",
                                    "@": {
                                        "lang": "pl"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }

        this.expected = {
            "translations": {
                "blog.HELLO": {
                    "en": "Hello",
                    "de": "Halo",
                    "fr": "Bnjour",
                    "pl": "Cześć"
                },
                "blog.GREEN": {
                    "en": "green",
                    "de": "grün",
                    "fr": "vert",
                    "pl": "zielony"
                }
            },
            "$": [
                {
                    "xmlns": "http://www.cyrhla.com/2017/schema/translator",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                    "xsi:schemaLocation": "http://www.cyrhla.com/2017/schema/translator http://www.cyrhla.com/2017/schema/translator-1.0.xsd"
                }
            ]
        }

        this.expectedCustomKeys = {
            "translations": {
                "blog.HELLO": {
                    "en": "Hello",
                    "de": "Halo",
                    "fr": "Bnjour",
                    "pl": "Cześć"
                },
                "blog.GREEN": {
                    "en": "green",
                    "de": "grün",
                    "fr": "vert",
                    "pl": "zielony"
                }
            },
            "@": [
                {
                    "xmlns": "http://www.cyrhla.com/2017/schema/translator",
                    "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                    "xsi:schemaLocation": "http://www.cyrhla.com/2017/schema/translator http://www.cyrhla.com/2017/schema/translator-1.0.xsd"
                }
            ]
        }
    }

    testConstructorArgumentInvalidTypeError()
    {
        var self = this

        // Invalid obj.
        var args = ['', 0, null, false, Object, Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                new TranslatorXmlNormalizer(arg, self.attrKey, self.charKey)
            }, index)
        }

        // Invalid attrKey.
        var args = [0, null, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                new TranslatorXmlNormalizer(self.obj, arg, self.charKey)
            }, index)
        }

        // Invalid charKey.
        var args = [0, null, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                new TranslatorXmlNormalizer(self.obj, self.attrKey, arg)
            }, index)
        }
    }

    testAllReturnsObject()
    {
        var translatorXmlNormalizer = new TranslatorXmlNormalizer(this.obj, this.attrKey, this.charKey)

        this.assertSame({}, translatorXmlNormalizer.all())
    }

    test_normalizeArgumentInvalidTypeError()
    {
        var translatorXmlNormalizer = new TranslatorXmlNormalizer(this.obj, this.attrKey, this.charKey)
        var self = this

        // Invalid obj.
        var args = ['', 0, null, false, Object, Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                translatorXmlNormalizer._normalize(arg, self.attrKey, self.charKey)
            }, index)
        }

        // Invalid attrKey.
        var args = [0, null, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                translatorXmlNormalizer._normalize(self.obj, arg, self.charKey)
            }, index)
        }

        // Invalid charKey.
        var args = [0, null, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                translatorXmlNormalizer._normalize(self.obj, self.attrKey, arg)
            }, index)
        }
    }

    test_normalizeReturnsObject()
    {
        var translatorXmlNormalizer = new TranslatorXmlNormalizer(this.obj, this.attrKey, this.charKey)

        this.assertSame({}, translatorXmlNormalizer._normalize(this.obj, this.attrKey, this.charKey))

        var obj = {"foo":"bar","baz":null}
        this.assertSame({}, translatorXmlNormalizer._normalize(obj, this.attrKey, this.charKey))

        this.assertSame(this.expected, translatorXmlNormalizer._normalize(this.parseObj, this.attrKey, this.charKey))
        this.assertSame(this.expectedCustomKeys, translatorXmlNormalizer._normalize(this.parseObjWithCustomKeysAttributes, '@', '='))
    }

    test_normalizeIdAttributeReferenceError()
    {
        var self = this

        this.assertError('IdAttributeReferenceError', function() {
            new TranslatorXmlNormalizer(self.parseObjWithoutIdAttribute, self.attrKey, self.charKey)
        })
    }

    test_normalizeLangAttributeReferenceError()
    {
        var self = this

        this.assertError('LangAttributeReferenceError', function() {
            new TranslatorXmlNormalizer(self.parseObjWithoutLangAttribute, self.attrKey, self.charKey)
        })
    }

    testProcessArgumentInvalidTypeError()
    {
        var self = this

        // Invalid obj.
        var args = ['', 0, null, false, Object, Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                TranslatorXmlNormalizer.process(arg, self.attrKey, self.charKey)
            }, index)
        }

        // Invalid attrKey.
        var args = [0, null, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                TranslatorXmlNormalizer.process(self.obj, arg, self.charKey)
            }, index)
        }

        // Invalid charKey.
        var args = [0, null, false, Object, new Object(), Symbol('foo'), /^/, [], undefined]
        for (let [index, arg] of args.entries()) {
            this.assertError('InvalidTypeError', function() {
                TranslatorXmlNormalizer.process(self.obj, self.attrKey, arg)
            }, index)
        }
    }

    testProcessIdAttributeReferenceError()
    {
        var self = this

        this.assertError('IdAttributeReferenceError', function() {
            TranslatorXmlNormalizer.process(self.parseObjWithoutIdAttribute, self.attrKey, self.charKey)
        })
    }

    testProcessLangAttributeReferenceError()
    {
        var self = this

        this.assertError('LangAttributeReferenceError', function() {
            TranslatorXmlNormalizer.process(self.parseObjWithoutLangAttribute, self.attrKey, self.charKey)
        })
    }

    testProcessReturnsObject()
    {
        this.assertSame({}, TranslatorXmlNormalizer.process(this.obj, this.attrKey, this.charKey))

        var obj = {"foo":"bar","baz":null}
        this.assertSame({}, TranslatorXmlNormalizer.process(obj, this.attrKey, this.charKey))

        this.assertSame(this.expected, TranslatorXmlNormalizer.process(this.parseObj, this.attrKey, this.charKey))
        this.assertSame(this.expectedCustomKeys, TranslatorXmlNormalizer.process(this.parseObjWithCustomKeysAttributes, '@', '='))
    }
}

