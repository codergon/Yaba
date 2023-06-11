const SERVER_URL = "https://yaba.onrender.com";

var tester =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

export const doubleDigit = val =>
  Number(val) >= 10 ? Number(val) : "0" + Number(val);

const isToday = activeDate =>
  activeDate.getDate() === new Date().getDate() &&
  activeDate.getMonth() === new Date().getMonth();

const isValidUrl = urlString => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};

export const EmailValidator = {
  validate(email) {
    if (!email) return false;

    var emailParts = email.split("@");

    if (emailParts.length !== 2) return false;

    var account = emailParts[0];
    var address = emailParts[1];

    if (account.length > 64) return false;
    else if (address.length > 255) return false;

    var domainParts = address.split(".");
    if (
      domainParts.some(function (part) {
        return part.length > 63;
      })
    )
      return false;

    if (!tester.test(email)) return false;

    return true;
  },
};

// wrapper function, on V3 manifest storage has promises
function storageSet(obj = {}) {
  return new Promise((resolve, reject) => {
    var storageObj = {};
    for (let u = 0; u < Object.keys(obj).length; u++) {
      const key = Object.keys(obj)[u];
      const objectToStore = obj[key];
      var jsonstr = JSON.stringify(objectToStore);
      var i = 0;

      while (jsonstr.length > 0) {
        var index = key + "USEDTOSEPERATE" + i++;

        const maxLength =
          chrome.storage.sync.QUOTA_BYTES_PER_ITEM - index.length - 2;
        var valueLength = jsonstr.length;
        if (valueLength > maxLength) {
          valueLength = maxLength;
        }

        var segment = jsonstr.substring(0, valueLength);
        var jsonLength = JSON.stringify(segment).length;
        segment = jsonstr.substring(
          0,
          (valueLength = valueLength - (jsonLength - maxLength) - 1)
        );
        for (let i = 0; i < chrome.storage.sync.QUOTA_BYTES_PER_ITEM; i++) {
          jsonLength = JSON.stringify(segment).length;
          if (jsonLength > maxLength) {
            segment = jsonstr.substring(0, --valueLength);
          } else {
            break;
          }
        }

        storageObj[index] = segment;
        jsonstr = jsonstr.substring(valueLength, Infinity);
      }
    }
    chrome.storage.sync.set(storageObj).then(() => {
      resolve();
    });
  });
}

function storageGet(uniqueKeys = []) {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(null).then(data => {
      const keyArr = Object.keys(data).filter(
        e => uniqueKeys.filter(j => e.indexOf(j) == 0).length > 0
      );
      chrome.storage.sync.get(keyArr).then(items => {
        var results = {};
        for (let i = 0; i < uniqueKeys.length; i++) {
          const uniqueKey = uniqueKeys[i];
          const keysFiltered = keyArr.filter(
            e => e.split("USEDTOSEPERATE")[0] == uniqueKey
          );
          if (keysFiltered.length > 0) {
            results[uniqueKey] = "";
            for (let x = 0; x < keysFiltered.length; x++) {
              results[uniqueKey] += items[`${keysFiltered[x]}`];
            }
            results[uniqueKey] = JSON.parse(results[uniqueKey]);
          }
        }
        resolve(results);
      });
    });
  });
}

const numToWords = numba => {
  var ones = [
    "",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  var tens = [
    "",
    "",
    "twenty",
    "thirty",
    "forty",
    "fifty",
    "sixty",
    "seventy",
    "eighty",
    "ninety",
  ];
  var teens = [
    "ten",
    "eleven",
    "twelve",
    "thirteen",
    "fourteen",
    "fifteen",
    "sixteen",
    "seventeen",
    "eighteen",
    "nineteen",
  ];

  function convert_millions(num) {
    if (num >= 1000000) {
      return (
        convert_millions(Math.floor(num / 1000000)) +
        " million " +
        convert_thousands(num % 1000000)
      );
    } else {
      return convert_thousands(num);
    }
  }

  function convert_thousands(num) {
    if (num >= 1000) {
      return (
        convert_hundreds(Math.floor(num / 1000)) +
        " thousand " +
        convert_hundreds(num % 1000)
      );
    } else {
      return convert_hundreds(num);
    }
  }

  function convert_hundreds(num) {
    if (num > 99) {
      return (
        ones[Math.floor(num / 100)] + " hundred " + convert_tens(num % 100)
      );
    } else {
      return convert_tens(num);
    }
  }

  function convert_tens(num) {
    if (num < 10) return ones[num];
    else if (num >= 10 && num < 20) return teens[num - 10];
    else {
      return tens[Math.floor(num / 10)] + " " + ones[num % 10];
    }
  }

  if (numba === 0 || isNaN(numba)) return "zero";
  else return convert_millions(numba);
};

export { isToday, numToWords, storageGet, storageSet, isValidUrl, SERVER_URL };
