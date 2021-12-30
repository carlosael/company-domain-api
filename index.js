const express = require("express");
const axios = require("axios");
const fs = require("fs/promises");

let companiesDomain = require("./empresas.json");

const app = express();

app.get("/empresas/:dominioEmpresa/", async (req, res) => {
    const company = (req.params.dominioEmpresa);

    const companyFound = companiesDomain.find(domains => domains.domain === company);

    if (companyFound) {
        res.json(companyFound)
    } else {
        const instanciaAxios = axios.create({
            baseURL: 'https://companyenrichment.abstractapi.com/v1/',
            params: {
                api_key: '2b65851347f642cdaec3253fa13deb17',
                domain: company
            }
        });

        const promise = await instanciaAxios.get();
        companiesDomain.push(promise.data)
        fs.writeFile("./empresas.json", JSON.stringify(companiesDomain));

        res.json(promise.data);
    }
})

app.listen(8000);