module.exports = 
{
    name: "pushMessages",
    description: "pushes messages onto a target array and returns the resulant array",
    execute(messages, destination)
    {
        for(i of messages)
        {
            destination.push(i)
        }

        return destination
    }

}