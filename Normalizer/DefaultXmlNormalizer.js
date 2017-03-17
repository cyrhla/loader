/**
 * @package @cyrhla/loader
 * @license MIT
 * @copyright Krystian Pietruszka <kpietru@cyrhla.com>
 * @see http://www.cyrhla.com
 */

'use strict'

const valid                           = require('@cyrhla/tester/valid')
const ResourceAttributeReferenceError = require('@cyrhla/loader/Error/ResourceAttributeReferenceError')

/**
 * Normalizes the object.
 *
 * @see @cyrhla/loader/Loader
 *
 * @author Krystian Pietruszka <kpietru@cyrhla.com>
 */
module.exports = class DefaultXmlNormalizer
{
    /**
     * Processes of normalization of imports.
     *
     * @see @cyrhla/loader/Loader
     *
     * @param object      obj
     * @param string      attrKey
     * @param string      charKey
     * @param null|string importsKey
     *
     * @throws ResourceAttributeReferenceError
     *
     * @return object
     */
    static process(obj, attrKey, charKey, importsKey)
    {
        valid(obj, 'object')
        valid(attrKey, 'string')
        valid(charKey, 'string')
        valid(importsKey, 'null', 'string')

        var temp = {}

        if (importsKey !== null && importsKey in obj) {
            temp[importsKey] = []
            for (let value of obj[importsKey]) {
                if (('import' in value) === false) {
                    continue
                }

                for (let v of value['import']) {
                    if ((attrKey in v) === false || ('resource' in v[attrKey]) === false) {
                        throw new ResourceAttributeReferenceError('@param resource attribute is not defined.')
                    }

                    temp[importsKey].push(v[attrKey]['resource'])
                }
            }
        }

        return temp
    }
}

