/**
 * @package @cyrhla/loader
 * @license MIT
 * @copyright Krystian Pietruszka <kpietru@cyrhla.com>
 * @see http://www.cyrhla.com
 */

'use strict'

const is                          = require('@cyrhla/tester/is')
const valid                       = require('@cyrhla/tester/valid')
const IdAttributeReferenceError   = require('@cyrhla/loader/Error/IdAttributeReferenceError')
const LangAttributeReferenceError = require('@cyrhla/loader/Error/LangAttributeReferenceError')

/**
 * Normalizes the object translator.
 *
 * @see @cyrhla/translator/Translator
 *
 * @author Krystian Pietruszka <kpietru@cyrhla.com>
 */
module.exports = class TranslatorXmlNormalizer
{
    /**
     * Initializes this class with the given options.
     *
     * @param object obj
     * @param string attrKey
     * @param string charKey
     */
    constructor(obj, attrKey, charKey)
    {
        valid(obj, 'object')
        valid(attrKey, 'string')
        valid(charKey, 'string')

        /** @type object */
        this._data = this._normalize(obj, attrKey, charKey)
    }

    /**
     * Gets all elements.
     *
     * @return object
     */
    all()
    {
        return this._data
    }

    /**
     * Normalizes the object translator.
     *
     * @param object obj
     * @param string attrKey
     * @param string charKey
     *
     * @throws IdAttributeReferenceError
     * @throws LangAttributeReferenceError
     *
     * @return object
     */
    _normalize(obj, attrKey, charKey)
    {
        valid(obj, 'object')
        valid(attrKey, 'string')
        valid(charKey, 'string')

        var temp = {}

        if ('translations' in obj) {
            temp['translations'] = {}
            for (let value of obj['translations']) {
                if (('translation' in value) === false) {
                    continue
                }

                for (let translation of value['translation']) {
                    if ((attrKey in translation) === false || ('id' in translation[attrKey]) === false) {
                        throw new IdAttributeReferenceError('@param id attribute is not defined.')
                    }

                    temp['translations'][translation[attrKey]['id']] = {}

                    if ('text' in translation) {
                        for (let text of translation['text']) {
                            if ((attrKey in text) === false || ('lang' in text[attrKey]) === false) {
                                throw new LangAttributeReferenceError('@param lang attribute is not defined.')
                            }

                            temp['translations'][translation[attrKey]['id']][text[attrKey]['lang']] = text[charKey]
                        }
                    }
                }
            }
        }

        // Global attributes.
        if (attrKey in obj && !is(obj[attrKey], 'array')) {
            if ((attrKey in temp) === false) {
                temp[attrKey] = []
            }
            temp[attrKey].push(obj[attrKey])
        }

        return temp
    }

    /**
     * Processes of normalization of translator.
     *
     * @see @cyrhla/translator/Translator
     *
     * @param object obj
     * @param string attrKey
     * @param string charKey
     *
     * @return object
     */
    static process(obj, attrKey, charKey)
    {
        valid(obj, 'object')
        valid(attrKey, 'string')
        valid(charKey, 'string')

        return new TranslatorXmlNormalizer(obj, attrKey, charKey)
            .all()
    }
}

