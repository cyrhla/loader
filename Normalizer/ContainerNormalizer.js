/**
 * @package @cyrhla/loader
 * @license MIT
 * @copyright Krystian Pietruszka <kpietru@cyrhla.com>
 * @see http://www.cyrhla.com
 */

'use strict'

const valid = require('@cyrhla/tester/valid')

/**
 * Normalizes the object container.
 *
 * @see @cyrhla/container/Container
 *
 * @author Krystian Pietruszka <kpietru@cyrhla.com>
 */
module.exports = class ContainerNormalizer
{
    /**
     * Initializes this class with the given options.
     *
     * @param object obj
     */
    constructor(obj)
    {
        valid(obj, 'object')

        /** @type object */
        this._data = this._normalize(obj)
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
     * Normalizes the object container.
     *
     * @param object obj
     *
     * @return object
     */
    _normalize(obj)
    {
        valid(obj, 'object')

        var temp = {}

        // translations, routing (?)

        if ('parameters' in obj) {
            for (let key in obj['parameters']) {
                var value = obj['parameters'][key]
                temp['parameters.' + key] = value
            }

            delete obj['parameters']
        }

        if ('translations' in obj) {
            var value = obj['translations']
            temp['parameters.translations'] = value

            delete obj['translations']
        }

        if ('routing' in obj) {
            var value = obj['routing']
            temp['parameters.routing'] = value

            delete obj['routing']
        }

        if ('services' in obj) {
            for (let key in obj['services']) {
                var value = obj['services'][key]
                temp['services.' + key] = value
            }

            delete obj['services']
        }

        return temp
    }

    /**
     * Processes of normalization of container.
     *
     * @see @cyrhla/container/Container
     *
     * @param object obj
     *
     * @return object
     */
    static process(obj)
    {
        valid(obj, 'object')

        return new ContainerNormalizer(obj)
            .all()
    }
}

