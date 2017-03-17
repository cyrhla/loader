loader
======
**This is development (master) version.<br> For production version (relase) see
<http://github.com/cyrhla/loader/tree/v0.0.1>**
- Version: 0.0.1-dev
- Technologies:
  - JavaScript
- Copyright / Authors:
  - Krystian Pietruszka <kpietru@cyrhla.com>
- Licenses:
  - MIT <http://spdx.org/licenses/MIT>
- Download: <http://github.com/cyrhla/loader/releases>
- Homepage: <http://www.cyrhla.com>
- More: package.json

Loads, parses and outputs the data (YAML, JSON, XML) as object.
_______________________________________________________________

Install
-------

    npm install @cyrhla/loader

Usage
-----

### Simple example

The data file (data.yml)*:

    foo:
        - 1
        - 2
        - 3

Execution script, save the file and run*:

    const Loader = require('@cyrhla/loader/Loader')

    var obj = new Loader('data.yml')
        .parseFile()

    console.log(obj)
    // { foo: [1, 2, 3] }

### Complicated example

Install XSD validation for Node.js using "libxml":

    npm install libxml-xsd

The data file (data.xml) with the key to importing additional files*:

    <?xml version="1.0" encoding="utf-8"?>
    <container
        xmlns="http://www.cyrhla.com/2017/schema/container"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.cyrhla.com/2017/schema/container http://www.cyrhla.com/2017/schema/container-0.0.1.xsd">

        <!--
        <imports>
            <import resource="data2.yml"/>
            <import resource="data3.json"/>
        </imports>
        -->

        <parameters>
            <parameter id="parameters.age">21</parameter>
            <parameter id="parameters.switcher">true</parameter>
        </parameters>

        <services>

            <service id="foo" alias="f" class="@some/module/Foo" public="true">
                <argument>%parameters.age%</argument>
                <argument>%parameters.switcher%</argument>
                <call method="someMethod">
                    <argument>true</argument>
                </call>
                <tag>tag1</tag>
                <tag>tag2</tag>
            </service>

            <!-- ... -->

        </services>

    </container>

For performance, the XSD file (http://www.cyrhla.com/2017/schema/container-0.0.1.xsd)
should be written locally in the same directory as the XML file
or in a subdirectory named "schema".

Execution script, save the file and run*:

    const LibxmlXsd               = require('libxml-xsd')
    const Loader                  = require('@cyrhla/loader/Loader')
    const ContainerNormalizer     = require('@cyrhla/loader/Normalizer/ContainerNormalizer')
    const ContainerXmlNormalizer  = require('@cyrhla/loader/Normalizer/ContainerXmlNormalizer')
    const TranslatorXmlNormalizer = require('@cyrhla/loader/Normalizer/TranslatorXmlNormalizer')
    const XsdValidatorSyntaxError = require('@cyrhla/framework-bundle/Error/XsdValidatorSyntaxError')

    var obj = new Loader('data.xml')

        // Normalizer for @cyrhla/translator
        .addXmlNormalizer(TranslatorXmlNormalizer.process)

        // Normalizer for @cyrhla/container
        .addXmlNormalizer(ContainerXmlNormalizer.process)
        .addNormalizer(ContainerNormalizer.process)
        .setXsdValidator(function(xsd, xml) {

            var validationErrors = LibxmlXsd
                .parse(xsd)
                .validate(xml)

            if (validationErrors) {
                throw new XsdValidatorSyntaxError(validationErrors)
            }

        })
        .parseFile()

    console.log(obj)
    // { parameters: ..., services: ... }

API
---

### Class Loader (Loader.js)

- Loader( string: __file__, string: __importsKey__ = Loader.IMPORTS_KEY, object: __xmlOptions__ = {} )
  - static get IMPORTS_KEY: string
  - static get XML_ATTRIBUTE_KEY: string
  - static get XML_CHAR_KEY: string
  - static get XML_PROCESORS: function[]
  - setImportsKey( null|string: __importsKey__ ): self
  - getImportsKey(): null|string
  - setXmlOptions( object: __xmlOptions__ ): self
  - getXmlOptions(): object
  - setXsdValidator( null|function( string: __xsd__, string: __xml__ ): __xsdValidator__ ): self
  - getXsdValidator(): null|function
  - addXmlNormalizer( function( object: __data__, string: __attrKey__, string: __charKey__, null|string: __importsKey__): __xmlNormalizer__ ): self
  - getXmlNormalizers(): function[]
  - addNormalizer( function( object: __data__, string: __attrKey__, string: __charKey__, null|string: __importsKey__): __normalizer__ ): self
  - getNormalizers(): function[]
  - parseFile(): object

References
----------

1. [Node.js Documentation][1]
2. [xml2js - Simple XML to JavaScript object converter][2]
3. [yamljs - Standalone JavaScript YAML 1.2 Parser & Encoder][3]

[1]: http://nodejs.org/api/modules.html
[2]: http://www.npmjs.com/package/xml2js
[3]: http://www.npmjs.com/package/yamljs

___________________________________________
[*] Paths should be modified to the module.
