
import { Configuration, DefaultApi } from "../../api";

const getAPIClient = () => {
    const configuration = new Configuration({
        basePath: "http://localhost:8000",
    });
    const api = new DefaultApi(configuration);
    return api;
}

export default getAPIClient;