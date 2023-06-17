export class Muteall
{
    public static commandName = "muteall";
    public static description = "Mutes everyone in the channel";
    public static aliases = [];
    public execute(message, args)
    {
        const voiceChannel = message.member.voice.channel
        let members = voiceChannel.members.array()
        for(let i of members) {
            i.voice.setMute(true, "Muted")
        }
    }
}
