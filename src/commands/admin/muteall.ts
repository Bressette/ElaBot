module.exports = 
{
    name: "muteall",
    description: "Mutes everyone in the channel",
    aliases: [],
    execute(message, args)
    {
        const voiceChannel = message.member.voice.channel
        let members = voiceChannel.members.array()
        for(let i of members) {
            i.voice.setMute(true, "Muted")
        }
    }
}