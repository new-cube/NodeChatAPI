const fs = require('fs');
var CRC32 = require("crc-32");
var async = require("async");

function binarySearch(arr, val) {
  let start = 0;
  let end = arr.length - 1;

  while (start <= end) {
    let mid = Math.floor((start + end) / 2);

    if (arr[mid] === val) {
      return mid;
    }

    if (val < arr[mid]) {
      end = mid - 1;
    } else {
      start = mid + 1;
    }
  }
  return -1;
}

function getId(username) {
  var ids = fs.readFileSync("./storage/ids.txt").toString();
  var splitIds = ids.split('|');
  console.log(splitIds);
  const index = binarySearch(splitIds, username);
  console.log(index);
  let finalID = index - 1;
  return splitIds[finalID];
}

function checkBan(id) {
  var ids = fs.readFileSync("./storage/bannedIDs.txt").toString();
  var splitIds = ids.split('|');
  const index = binarySearch(splitIds, id);
  if(index == -1) {
    return false;
  } else {
    return true;
  }
}

 function verifyID(id, usr) {
  console.log(id, usr);
  var verifyUser = getId(usr);
  console.log(verifyUser);
  if(id != null) {
    var parsedID = id.split(':');
  } else {
    var parsedID = [123,23,1234];
  }
  console.log(parsedID);
  console.log(parsedID[1]);
  console.log(parsedID[0]);
  //let checksum = CRC32.str(parsedID[1] + parsedID[0]);
  //console.log(checksum);
  let isBanned = checkBan(id);
  console.log(isBanned);

  if(verifyUser == id && !isBanned) {
    return true;
  } else {
    return false;
  }
}

module.exports = { getId, checkBan, binarySearch, verifyID };