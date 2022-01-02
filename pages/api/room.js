const { managementApiHelper, appToken } = require("./_100ms");

export default async (req, res) => {
    if (req.method === "GET") {
        res.send({
        statusCode: 200,
        data: { message: "Not implemented" }
        });
        return;
    }
    let data, code;
    try {
        console.log({ body: req.body });
        const incoming = JSON.parse(req.body);
        console.log(incoming);
        const name = incoming.name;
        const body = {
            name,
            "description": "audli api generated",
            template: "default_videoconf_15423f10-d38b-4d59-b5b1-d25313bfc72b"
        }

        const roomBody = JSON.stringify(body);
        const room = await managementApiHelper("post", "/rooms", roomBody);
        res.send({ room })
        return
        const randomStr = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
        const token = appToken(room.id, `user_${randomStr}`, "trainer");
        data = { token, room };
        console.log(data);
        code = 200;

    } catch (e) {
        console.log("error: ", e);
        data = { error: e.message };
        code = 500;
    }
    return res.send({
        statusCode: code,
        data,
    });
};
