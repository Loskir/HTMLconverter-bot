import { MessageEntity } from "../deps.deno.ts";

function escape(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  // .replace(/"/g, "&quot;")
  // .replace(/\'/g, "&#x27;");
}

// Taken from https://github.com/tginfo/translator-bot/blob/acd27d9e63dc177d49126ecc958a21d1bb34a423/utils.ts#L131
function unparse(
  text: string,
  entities: MessageEntity[],
  offset = 0,
  length?: number,
): string {
  if (!text) return text;
  else if (entities.length == 0) return escape(text);

  length = length ?? text.length;

  const html: string[] = [];
  let lastOffset = 0;

  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];

    if (entity.offset >= offset + length) break;

    const relativeOffset = entity.offset - offset;

    if (relativeOffset > lastOffset) {
      html.push(escape(text.slice(lastOffset, relativeOffset)));
    } else if (relativeOffset < lastOffset) continue;

    let skipEntity = false;
    const length_ = entity.length;
    const text_ = unparse(
      text.slice(relativeOffset, relativeOffset + length_),
      entities.slice(i + 1, entities.length),
      entity.offset,
      length_,
    );

    switch (entity.type) {
      case "bold":
        html.push(`<b>${text_}</b>`);
        break;
      case "italic":
        html.push(`<i>${text_}</i>`);
        break;
      case "underline":
        html.push(`<u>${text_}</u>`);
        break;
      case "strikethrough":
        html.push(`<s>${text_}</s>`);
        break;
      case "text_link":
        html.push(`<a href="${entity.url}">${text_}</a>`);
        break;
      case "text_mention":
        html.push(`<a href="tg://user?id=${entity.user.id}">${text_}</a>`);
        break;
      case "spoiler":
        html.push(`<span class="tg-spoiler">${text_}</span>`);
        break;
      case "code":
        html.push(`<code>${text_}</code>`);
        break;
      case "pre":
        html.push(
          `<pre${
            entity.language && ` class="${entity.language}"`
          }>${text_}</pre>`,
        );
        break;
      default:
        skipEntity = true;
    }

    lastOffset = relativeOffset + (skipEntity ? 0 : length_);
  }

  html.push(escape(text.slice(lastOffset, text.length)));

  return html.join("");
}

export function formatHTML(text = "", entities: MessageEntity[] = []) {
  return unparse(text, entities);
}
