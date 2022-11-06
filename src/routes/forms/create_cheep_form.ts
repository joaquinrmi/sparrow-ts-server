import CheepData from "../../model/cheep/cheep_data";

type CreateCheepForm = {
    responseTarget?: CheepData["id"];
    quoteTarget?: CheepData["id"];
    content?: CheepData["content"];
    gallery?: CheepData["gallery"];
};

export default CreateCheepForm;