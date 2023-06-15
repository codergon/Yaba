const SERVER_URL: string = "https://yaba.onrender.com";

const tester: RegExp =
  /^[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

export const doubleDigit = (val: number): number | string =>
  val >= 10 ? val : "0" + val;

const isToday = (activeDate: Date): boolean =>
  activeDate.getDate() === new Date().getDate() &&
  activeDate.getMonth() === new Date().getMonth();

const isValidUrl = (urlString: string): boolean => {
  try {
    return Boolean(new URL(urlString));
  } catch (e) {
    return false;
  }
};

export const EmailValidator = {
  validate(email: string): boolean {
    if (!email) return false;

    const emailParts = email.split("@");

    if (emailParts.length !== 2) return false;

    const account = emailParts[0];
    const address = emailParts[1];

    if (account.length > 64) return false;
    else if (address.length > 255) return false;

    const domainParts = address.split(".");
    if (
      domainParts.some((part: string) => {
        return part.length > 63;
      })
    )
      return false;

    if (!tester.test(email)) return false;

    return true;
  },
};

function storageSet(obj: { [key: string]: any } = {}): Promise<void> {
  return new Promise((resolve, reject) => {
    const storageObj: { [key: string]: any } = {};
    for (let u = 0; u < Object.keys(obj).length; u++) {
      const key = Object.keys(obj)[u];
      const objectToStore = obj[key];
      var jsonstr = JSON.stringify(objectToStore);
      let i = 0;

      while (jsonstr.length > 0) {
        const index = key + "USEDTOSEPERATE" + i++;

        const maxLength =
          chrome.storage.sync.QUOTA_BYTES_PER_ITEM - index.length - 2;
        let valueLength = jsonstr.length;
        if (valueLength > maxLength) {
          valueLength = maxLength;
        }

        let segment = jsonstr.substring(0, valueLength);
        let jsonLength = JSON.stringify(segment).length;
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

function storageGet(
  uniqueKeys: string[] = []
): Promise<{ [key: string]: any }> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(null).then(data => {
      const keyArr = Object.keys(data).filter(
        (e: string) =>
          uniqueKeys.filter((j: string) => e.indexOf(j) == 0).length > 0
      );
      chrome.storage.sync.get(keyArr).then(items => {
        const results: { [key: string]: any } = {};
        for (let i = 0; i < uniqueKeys.length; i++) {
          const uniqueKey = uniqueKeys[i];
          const keysFiltered = keyArr.filter(
            (e: string) => e.split("USEDTOSEPERATE")[0] == uniqueKey
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

const numToWords = (numba: number): string => {
  const ones: string[] = [
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
  const tens: string[] = [
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
  const teens: string[] = [
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

  function convert_millions(num: number): string {
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

  function convert_thousands(num: number): string {
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

  function convert_hundreds(num: number): string {
    if (num > 99) {
      return (
        ones[Math.floor(num / 100)] + " hundred " + convert_tens(num % 100)
      );
    } else {
      return convert_tens(num);
    }
  }

  function convert_tens(num: number): string {
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
