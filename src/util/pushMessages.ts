export class PushMessages
{
    static commandName = "pushMessages";
    static description = "pushes messages onto a target array and returns the resultant array";
    static execute(messages, destination)
    {
        for(const i of messages)
        {
            destination.push(i)
        }

        return destination
    }

}
