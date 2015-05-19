#!/usr/bin/env node --es_staging

var Madagascar = require("../lib"),
    settings = require("../test/test_settings.json");



(new Madagascar(settings)).start();
