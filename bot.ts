import { Bot } from "./deps.deno.ts";
import { formatHTML } from "./lib/formatHTML.ts";

export const bot = new Bot(Deno.env.get("TOKEN") || "");

bot.command("start", (ctx) => {
  return ctx.reply(
    `This bot helps you convert formatted Telegram messages into raw HTML. It can be useful for developing Telegram bots.

Built by @Loskir (@Loskirs)
Hosted on 🦕 Deno Deploy

Send me a message to convert it`,
  );
});

bot.on("message:text", (ctx) => {
  const text = formatHTML(ctx.msg.text, ctx.msg.entities);
  return ctx.reply(text, {
    entities: [{
      type: "pre",
      language: "html",
      offset: 0,
      length: text.length,
    }],
  });
});

bot.on("message:caption", (ctx) => {
  const text = formatHTML(ctx.msg.caption, ctx.msg.caption_entities);
  return ctx.reply(text, {
    entities: [{
      type: "pre",
      language: "html",
      offset: 0,
      length: text.length,
    }],
  });
});

bot.command("ping", (ctx) => ctx.reply(`Pong! ${new Date()} ${Date.now()}`));
