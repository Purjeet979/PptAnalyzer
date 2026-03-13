const JSZip = require('jszip');
const fs = require('fs');
const path = require('path');

async function createDummyPptx(fileName, text) {
  const zip = new JSZip();
  // Minimal structure required by our parser
  const slideXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<p:sld xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main">
  <p:cSld>
    <p:spTree>
      <p:sp>
        <p:txBody>
          <a:p>
            <a:r>
              <a:t>${text}</a:t>
            </a:r>
          </a:p>
        </p:txBody>
      </p:sp>
    </p:spTree>
  </p:cSld>
</p:sld>`;

  zip.file('ppt/slides/slide1.xml', slideXml);
  
  const content = await zip.generateAsync({ type: 'nodebuffer' });
  const filePath = path.join(__dirname, fileName);
  fs.writeFileSync(filePath, content);
  console.log(`Created ${filePath}`);
}

(async () => {
  await createDummyPptx('reference.pptx', 'This is the ideal hackathon presentation about a sustainable energy solution using AI.');
  await createDummyPptx('contender.pptx', 'A pitch for an AI powered energy dashboard for smart homes.');
})();
