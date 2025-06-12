require('dotenv').config();
console.log("Loaded token:", process.env.BOT_TOKEN ? "✓ Found" : "⛔ Not found");

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require('discord.js');

// Set up the client with necessary intents
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
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
      .setDescription('Click a button below to get more info.');

    // Initial button rows
    let row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('TT').setLabel('📘 TT').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('MT').setLabel('📗 MT').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('VoR').setLabel('📕 VoR').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('TK').setLabel('📙 TK').setStyle(ButtonStyle.Secondary)
    );

    let row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('IAU').setLabel('🔵 IAU').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('MLK').setLabel('🟢 MLK').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('Seed').setLabel('🔴 Seed').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('Emo').setLabel('🟡 Emo').setStyle(ButtonStyle.Secondary)
    );

    // Send the message
    const infoMessage = await message.channel.send({
      embeds: [embed],
      components: [row1, row2]
    });

    const collector = infoMessage.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async interaction => {
      await interaction.deferUpdate();

      // Disable only the clicked button
      [row1, row2] = [row1, row2].map(row => {
        return new ActionRowBuilder().addComponents(
          row.components.map(button => {
            if (button.data.custom_id === interaction.customId) {
              return ButtonBuilder.from(button).setDisabled(true);
            }
            return button;
          })
        );
      });

      embed.setDescription(`**${interaction.user.username}** clicked **${interaction.component.label}**.`);
      await interaction.editReply({
        embeds: [embed],
        components: [row1, row2]
      });
    });

    collector.on('end', async () => {
      // Optionally disable all buttons when time runs out
      const disabledRows = [row1, row2].map(row => {
        return new ActionRowBuilder().addComponents(
          row.components.map(button => ButtonBuilder.from(button).setDisabled(true))
        );
      });

      await infoMessage.edit({ components: disabledRows });
    });
  }
});

client.login(process.env.BOT_TOKEN);
