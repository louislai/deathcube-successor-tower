"use strict";
/*
 * GameRecord
 */

 function clone(obj) {
  return JSON.parse(JSON.stringify(obj)); // Work on IE8+, Firefox 34+, Chrome 31+, Safari 7.1+, Opera 26+
 }
 
 var GameRecord = {"units": [], "towers": [], "rocks": []};