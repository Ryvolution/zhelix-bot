require('dotenv').config();
console.log("Loaded token:", process.env.BOT_TOKEN ? "✓ Found" : "⛔ Not found");

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');

// Set up the client with intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions
  ]
});

client.once('ready', () => {
  console.log(`🤖 Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {
  if (message.content === '!info') {
    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Info Panel')
      .setDescription('React to this message to change the info!');

    const infoMessage = await message.channel.send({ embeds: [embed] });

    // Add reactions
    await infoMessage.react('📘');
    await infoMessage.react('📗');

    // Create a reaction collector
    const filter = (reaction, user) => !user.bot;
    const collector = infoMessage.createReactionCollector({ filter, time: 60000 });

    collector.on('collect', (reaction, user) => {
      if (reaction.emoji.name === '📘') {
        embed.setDescription('You selected the **blue book**!');
      } else if (reaction.emoji.name === '📗') {
        embed.setDescription('You selected the **green book**!');
      }
      infoMessage.edit({ embeds: [embed] });
    });
  }
});

client.login(process.env.BOT_TOKEN);
