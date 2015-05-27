#!/usr/bin/env node

var Madagascar = require("../lib"),
    settings = require("../test/test_settings.json");



(new Madagascar(settings)).start();
