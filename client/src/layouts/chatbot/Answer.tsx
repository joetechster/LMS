import { Box, Card } from "@mui/material";
import React from "react";

function convertTextToHTML(text: string) {
  text = formatText(text);
  const lines = text.split("\n");

  let html = "";
  for (const line of lines) {
    if (line.length < 1) continue;

    // Check if line starts with "* " (bullet point)
    if (line.startsWith("* ")) {
      html += `<li>${line.slice(2)}`; // Remove leading "* " and wrap in <li>
    } else {
      html += `${line}`; // Wrap other text in <p>
    }
  }

  return html;
}

function formatText(text: string) {
  // Replace bold text with <p class='bold'>...</p> tags
  let formattedText = text.replace(/\n\n/g, "<br/>\n");
  formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");

  return formattedText;
}

const text =
  "Possible causes:\n\n* **Viral infection (like the flu or COVID-19):** Fever, muscle aches, and cough are common symptoms \nof viral infections.\n* **Bacterial infection (like pneumonia):** While less common, a bacterial infection can also cause fever, muscle aches, and cough.\n* **Other illnesses:** Other illnesses like bronchitis, sinusitis, or even a common cold can also lead to these symptoms. \n";

const htmlString = convertTextToHTML(text);
// console.log(htmlString);

export default function Answer(props) {
  return (
    <Card
      sx={{ p: 2, fontSize: 14 }}
      dangerouslySetInnerHTML={{ __html: convertTextToHTML(props.text) }}
    />
  );
}
