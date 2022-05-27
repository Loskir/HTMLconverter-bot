import { MessageEntity } from "../deps.deno.ts";

export function formatHTML(text = "", entities: MessageEntity[] = []) {
  const chars = text;
  const available = [...entities];
  const opened: MessageEntity[] = [];
  const result: string[] = [];
  for (let offset = 0; offset < chars.length; offset++) {
    while (true) {
      const index = available.findIndex((entity) => entity.offset === offset);
      if (index === -1) {
        break;
      }
      const entity = available[index];
      switch (entity.type) {
        case "bold":
          result.push("<b>");
          break;
        case "italic":
          result.push("<i>");
          break;
        case "code":
          result.push("<code>");
          break;
        case "pre":
          if (entity.language) {
            result.push(`<pre><code class="language-${entity.language}">`);
          } else {
            result.push("<pre>");
          }
          break;
        case "strikethrough":
          result.push("<s>");
          break;
        case "underline":
          result.push("<u>");
          break;
        case "text_mention":
          result.push(`<a href="tg://user?id=${entity.user.id}">`);
          break;
        case "text_link":
          result.push(`<a href="${entity.url}">`);
          break;
      }
      opened.unshift(entity);
      available.splice(index, 1);
    }

    result.push(chars[offset]);

    while (true) {
      const index = opened.findIndex((entity) =>
        entity.offset + entity.length - 1 === offset
      );
      if (index === -1) {
        break;
      }
      const entity = opened[index];
      switch (entity.type) {
        case "bold":
          result.push("</b>");
          break;
        case "italic":
          result.push("</i>");
          break;
        case "code":
          result.push("</code>");
          break;
        case "pre":
          if (entity.language) {
            result.push("</code></pre>");
          } else {
            result.push("</pre>");
          }
          break;
        case "strikethrough":
          result.push("</s>");
          break;
        case "underline":
          result.push("</u>");
          break;
        case "text_mention":
        case "text_link":
          result.push("</a>");
          break;
      }
      opened.splice(index, 1);
    }
  }
  return result.join("");
}
