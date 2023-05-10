module.exports = {
    405: (_, res) => {
        return res.status(405).send({ message: "Method not allowed" });
    },

    404: (_, res) => {
        return res.status(404).send({ message: "Endpoint not found" });
    }
}