/**
 * @package @cyrhla/loader
 * @license MIT
 * @copyright Krystian Pietruszka <kpietru@cyrhla.com>
 * @see http://www.cyrhla.com
 */

'use strict'

const is                            = require('@cyrhla/tester/is')
const valid                         = require('@cyrhla/tester/valid')
const IdAttributeReferenceError     = require('@cyrhla/loader/Error/IdAttributeReferenceError')
const MethodAttributeReferenceError = require('@cyrhla/loader/Error/MethodAttributeReferenceError')

/**
 * Normalizes the object container.
 *
 * @see @cyrhla/container/Container
 *
 * @author Krystian Pietruszka <kpietru@cyrhla.com>
 */
module.exports = class ContainerXmlNormalizer
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
     * Gets the object "tagName" and "tagsName".
     *
     * @param object obj
     * @param string tagName
     * @param string tagsName
     *
     * @return array
     */
    _getTagAndTags(obj, tagName, tagsName)
    {
        valid(obj, 'object')
        valid(tagName, 'string')
        valid(tagsName, 'string')

        var arr = []

        if (tagName in obj) {
            arr = obj[tagName]
        }

        if (tagsName in obj) {
            for (let value of obj[tagsName]) {
                arr = arr.concat(value[tagName])
            }
        }

        return arr
    }

    /**
     * Gets the attribute "method" and arguments.
     *
     * @param object call
     * @param string attrKey
     *
     * @return array
     */
    _getMethodAndArguments(call, attrKey)
    {
        valid(call, 'object')
        valid(attrKey, 'string')

        var method = call[attrKey]['method']

        return [method, this._getTagAndTags(call, 'argument', 'arguments')]
    }

    /**
     * Gets the object "call" and "calls".
     *
     * @param object service
     * @param string attrKey
     *
     * @throws MethodAttributeReferenceError
     *
     * @return array[]
     */
    _getCallAndCalls(service, attrKey)
    {
        valid(service, 'object')
        valid(attrKey, 'string')

        var cls = []

        if ('call' in service) {
            for (let call of service['call']) {
                if ((attrKey in call) === false || ('method' in call[attrKey]) === false) {
                    throw new MethodAttributeReferenceError('@param method attribute is not defined.')
                }
                cls.push(this._getMethodAndArguments(call, attrKey))
            }
        }

        if ('calls' in service) {
            for (let calls of service['calls']) {
                for (let call of calls['call']) {
                    if ((attrKey in call) === false || ('method' in call[attrKey]) === false) {
                        throw new MethodAttributeReferenceError('@param method attribute is not defined.')
                    }
                    cls.push(this._getMethodAndArguments(call, attrKey))
                }
            }
        }

        return cls
    }

    /**
     * Normalizes the object container.
     *
     * @param object obj
     * @param string attrKey
     * @param string charKey
     *
     * @throws IdAttributeReferenceError
     *
     * @return object
     */
    _normalize(obj, attrKey, charKey)
    {
        valid(obj, 'object')
        valid(attrKey, 'string')
        valid(charKey, 'string')

        var temp = {}

        if ('parameters' in obj) {
            temp['parameters'] = {}
            for (let value of obj['parameters']) {
                if (('parameter' in value) === false) {
                    continue
                }

                for (let parameter of value['parameter']) {
                    if ((attrKey in parameter) === false || ('id' in parameter[attrKey]) === false) {
                        throw new IdAttributeReferenceError('@param id attribute is not defined.')
                    }

                    temp['parameters'][parameter[attrKey]['id']] = parameter[charKey]
                }
            }
        }

        if ('services' in obj) {
            temp['services'] = {}
            for (let value of obj['services']) {
                if (('service' in value) === false) {
                    continue
                }

                for (let service of value['service']) {
                    if ((attrKey in service) === false || ('id' in service[attrKey]) === false) {
                        throw new IdAttributeReferenceError('@param id attribute is not defined.')
                    }

                    var id = service[attrKey]['id']

                    temp['services'][id]              = service[attrKey]
                    temp['services'][id]['arguments'] = this._getTagAndTags(service, 'argument', 'arguments')
                    temp['services'][id]['calls']     = this._getCallAndCalls(service, attrKey)
                    temp['services'][id]['tags']      = this._getTagAndTags(service, 'tag', 'tags')
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
     * Processes of normalization of container.
     *
     * @see @cyrhla/container/Container
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

        return new ContainerXmlNormalizer(obj, attrKey, charKey)
            .all()
    }
}

