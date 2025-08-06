var MillName = "M/S OHAB HASKING MILL";
var Propritor = "MD HUMAYUN KABIR";
var MillAddress = "Thakurgaon Sadar, Thakurgaon";

function convertEnglishToBengaliDigits(str) {
  const engToBnDigits = {
    '0': '০',
    '1': '১',
    '2': '২',
    '3': '৩',
    '4': '৪',
    '5': '৫',
    '6': '৬',
    '7': '৭',
    '8': '৮',
    '9': '৯',
  };

  return str.replace(/[0-9]/g, digit => engToBnDigits[digit]);
}

function generateCustomNumber() {
  
 const prefixes = ['35', '36'];
  const bengaliDigits = ['০','১','২','৩','৪','৫','৬','৭','৮','৯'];

  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const remaining = Math.floor(Math.random() * 1_000_0000).toString().padStart(7, '0');
  const fullNumber = prefix + remaining;

  const bengaliNumber = [...fullNumber].map(d => bengaliDigits[parseInt(d)]).join('');
localStorage.setItem('id', '২৪২৫-০০'+bengaliNumber);
  return bengaliNumber;
}



function extractChallanObjectFromHTML() {
  const scripts = document.querySelectorAll('script');

  for (const script of scripts) {
    const text = script.textContent;
    const index = text.indexOf('"ChallanNo":');
    if (index === -1) continue;

    // Find the opening brace '{' before index
    let start = text.lastIndexOf('{', index);
    if (start === -1) continue;

    // Now find matching closing brace '}'
    let braceCount = 0;
    let end = -1;
    for (let i = start; i < text.length; i++) {
      if (text[i] === '{') braceCount++;
      else if (text[i] === '}') braceCount--;

      if (braceCount === 0) {
        end = i + 1;
        break;
      }
    }

    if (end === -1) continue; // no matching closing brace

    let jsonStr = text.slice(start, end);

    // Clean JSON string (quote keys, remove trailing commas)
    jsonStr = jsonStr
      .replace(/,\s*([}\]])/g, '$1')
      .replace(/([{,])\s*([a-zA-Z0-9_]+)\s*:/g, '$1"$2":')
      .replace(/'/g, '"');

    try {
      const obj = JSON.parse(jsonStr);

      console.log('✅ Extracted object:', obj);
      console.log('NameBn:', obj.NameBn);
      console.log('CurrentAddress:', obj.CurrentAddress);
      console.log('ClientByNameEn:', obj.ClientByNameEn);

      return obj;
    } catch (e) {
      console.error('❌ JSON parse error:', e.message);
      continue;
    }
  }

  console.warn('⚠️ No valid Challan JSON found.');
  return null;
}
var challaninfo = extractChallanObjectFromHTML()
const replacements = [
    [challaninfo.NameBn, MillName],
    [challaninfo.ClientByNameBn, "PRO-"+Propritor],
    [challaninfo.ClientByAddress, MillAddress],
    [localStorage.getItem('id'), '২৪২৫-০০'+generateCustomNumber()]
  ];

  function traverseAndReplace(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      let text = node.nodeValue;
      let changed = false;

      for (const [target, replacement] of replacements) {
        if (text.includes(target)) {
          text = text.replaceAll(target, replacement);
          changed = true;
        }
      }

      if (changed) {
        node.nodeValue = text;
      }
    } else {
      for (const child of node.childNodes) {
        traverseAndReplace(child);
      }
    }
  }

  // Run as soon as the script loads
  traverseAndReplace(document.body);
