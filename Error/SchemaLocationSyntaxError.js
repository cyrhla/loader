/**
 * @package @cyrhla/loader
 * @license MIT
 * @copyright Krystian Pietruszka <kpietru@cyrhla.com>
 * @see http://www.cyrhla.com
 */

'use strict'

/**
 * The SchemaLocationSyntaxError thrown when "...:schemaLocation" attribute
 * - XSD file is not defined.
 *
 * @author Krystian Pietruszka <kpietru@cyrhla.com>
 */
module.exports = class SchemaLocationSyntaxError extends SyntaxError
{
}

