const { MessageEmbed } = require("discord.js");

module.exports = async(client, interaction) => {
    if (!interaction.isCommand()) return;

    let cmd = await client.commands.get(interaction.commandName);
    if (!cmd) interaction.reply({ content: "Unknown command", ephemeral: true })
    else if (cmd.requirements.userPerms && !interaction.member.permissions.has(cmd.requirements.userPerms)) {
        interaction.reply({
            embeds: [new MessageEmbed()
                .setAuthor({ name: "Your Missing Permissions", iconURL: interaction.member.displayAvatarURL() })
                .addField(`**You are missing the following permissions**`, missingPerms(interaction.member, cmd.requirements.userPerms))
                .setColor("RED")
            ],
            ephemeral: true
        })
    } else if (cmd.requirements.clientPerms && !interaction.member.guild.me.permissions.has(cmd.requirements.clientPerms)) {
        interaction.reply({
            embeds: [new MessageEmbed()
                .setAuthor({ name: "Missing Permissions", iconURL: interaction.member.displayAvatarURL() })
                .addField(`**I don't have the following permissions**`, missingPerms(interaction.member, cmd.requirements.clientPerms))
                .setColor("RED")
            ],
            ephemeral: true
        })
    } else cmd.run(client, interaction, interaction.options)
};

const missingPerms = (interaction, perms) => {
    const missingPerms = interaction.permissions.missing(perms)
        .map(str => `\`${str.replace(/_/g, ' ').toLowerCase().replace(/\b(\w)/g, char => char.toUpperCase())}\``);

    return missingPerms.length > 1 ?
        `**${missingPerms.slice(0, -1).join(", ")}, ${missingPerms.slice(-1)[0]}**` :
        missingPerms[0];
}