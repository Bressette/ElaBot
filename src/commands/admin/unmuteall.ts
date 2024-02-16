export class Unmuteall
{
    static commandName = "unmuteall";
    static description = "Unmutes everyone in the channel";
    static aliases = [];
    execute(message, args)
    {
        const voiceChannel = message.member.voice.channel
        let members = voiceChannel.members.array()
        for(let i of members) {
            i.voice.setMute(false, "Muted")
        }
    }
}