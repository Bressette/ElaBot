importLinks: async (client) =>
{

    general = await client.channels.fetch("610639803662336021")
    maymays = await client.channels.fetch("507998836233338882")
    videos = await client.channels.fetch("507998917846106162")
    linksherenerds = await client.channels.fetch("518655793961369602")
    brucemad = await client.channels.fetch("559017797057773580")
    dcbadhaha = await client.channels.fetch("574067019381735435")
    rankedflex = await client.channels.fetch("589595674971209729")
    art = await client.channels.fetch("611679566938898626")
    minecraft = await client.channels.fetch("629133817101287443")
    epicbot = await client.channels.fetch("635974542468186142")
    spaceengineers = await client.channels.fetch("638374818059649024")
    lmaobryceislame = await client.channels.fetch("653714617268174848")
    vr = await client.channels.fetch("662437212633169950")
    bots = await client.channels.fetch("715776883945504769")

    allMessages = []
    messages = await module.exports.getMessages(general, 1000000)
    allMessages = module.exports.pushMessages(messages, allMessages)
    messages = await module.exports.getMessages(maymays, 1000000)
    allMessages = module.exports.pushMessages(messages, allMessages)
    messages = await module.exports.getMessages(videos, 1000000)
    allMessages = module.exports.pushMessages(messages, allMessages)
    messages = await module.exports.getMessages(linksherenerds, 1000000)
    allMessages = module.exports.pushMessages(messages, allMessages)
    messages = await module.exports.getMessages(brucemad, 1000000)
    allMessages = module.exports.pushMessages(messages, allMessages)
    messages = await module.exports.getMessages(dcbadhaha, 1000000)
    allMessages = module.exports.pushMessages(messages, allMessages)
    messages = await module.exports.getMessages(rankedflex, 1000000)
    allMessages = module.exports.pushMessages(messages, allMessages)
    messages = await module.exports.getMessages(art, 1000000)
    allMessages = module.exports.pushMessages(messages, allMessages)
    messages = await module.exports.getMessages(minecraft, 1000000)
    allMessages = module.exports.pushMessages(messages, allMessages)
    messages = await module.exports.getMessages(epicbot, 1000000)
    allMessages = module.exports.pushMessages(messages, allMessages)
    messages = await module.exports.getMessages(spaceengineers, 1000000)
    allMessages = module.exports.pushMessages(messages, allMessages)
    messages = await module.exports.getMessages(lmaobryceislame, 1000000)
    allMessages = module.exports.pushMessages(messages, allMessages)
    messages = await module.exports.getMessages(vr, 1000000)
    allMessages = module.exports.pushMessages(messages, allMessages)
    messages = await module.exports.getMessages(bots, 1000000)
    allMessages = module.exports.pushMessages(messages, allMessages)

    allMessages.sort(function(a, b) 
    {
        return new Date(a.createdAt) - new Date(b.createdAt)
    })
    console.log("After getting messages")

    

    for(i of allMessages)
    {
       try
       {
            await module.exports.archiveMessages(i, client)
       } catch(error) {
           console.log(error)
       }
       
    }


}