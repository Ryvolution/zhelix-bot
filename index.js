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

    // First row of 4 buttons
    const row1 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('TT').setLabel('📘 Option 1').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('MT').setLabel('📗 Option 2').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('VoR').setLabel('📕 Option 3').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setCustomId('TK').setLabel('📙 Option 4').setStyle(ButtonStyle.Primary)
    );

    // Second row of 4 buttons
    const row2 = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('IAU').setLabel('🔵 Option 5').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('MLK').setLabel('🟢 Option 6').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('Seed').setLabel('🔴 Option 7').setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId('Emo').setLabel('🟡 Option 8').setStyle(ButtonStyle.Secondary)
    );

    // Send message with embed and buttons
    const infoMessage = await message.channel.send({
      embeds: [embed],
      components: [row1, row2]
    });

    // Create interaction collector for 60 seconds
    const collector = infoMessage.createMessageComponentCollector({ time: 60000 });

    collector.on('collect', async interaction => {
      await interaction.deferUpdate(); // Avoid "interaction failed" error

      // Update embed with selected button info
      embed.setDescription(`You clicked **${interaction.component.label}**.`);
      await interaction.editReply({ embeds: [embed] });
    });

    collector.on('end', async () => {
      // Optionally disable buttons after 60 seconds
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
