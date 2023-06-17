export class Unmuteall
{
    public static commandName = "unmuteall";
    public static description = "Unmutes everyone in the channel";
    public static aliases = [];
    public static execute(message, args)
    {
        const voiceChannel = message.member.voice.channel
        let members = voiceChannel.members.array()
        for(let i of members) {
            i.voice.setMute(false, "Muted")
        }
    }
}
