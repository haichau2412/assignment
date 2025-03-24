import { getLocalStorage, setLocalStorage } from "../../libs/localStorage";
import { JSONSchema } from "../../libs/schema/schema-to-form/policySchemaParser";
import { v4 as uuidv4 } from 'uuid';
import EventEmitter from "event-emitter";

const emitter = EventEmitter()

export interface SavedPolicy {
    policySchemaId: string,
    contractId: string,
    contractName: string
    data: Record<string, any>
}

const LOCAL_POLICY_SCHEMA = "policySchema";
const LOCAL_SAVED_POLICY = "savedPolicy";

let _policySchema: (JSONSchema & { policyName: string })[] = [];
let _savedPolicy: SavedPolicy[] = [];

let initalized = false;


const init = () => {
    if (initalized) return;
    _policySchema = getLocalStorage(LOCAL_POLICY_SCHEMA, []);
    _savedPolicy = getLocalStorage(LOCAL_SAVED_POLICY, []);
    initalized = true;
};

const getPolicySchemaById = (productId: string) => {
    if (!initalized) {
        init();
    }
    const result = _policySchema.find((d) => d.productId === productId)
    if (result) {
        return structuredClone(result)
    }
};

const getAllPolicySchema = () => {
    if (!initalized) {
        init();
    }
    return structuredClone(_policySchema)
};

const addPolicySchema = (newPolicySchema: JSONSchema, policyName: string) => {
    const uuid = uuidv4()

    const newPolicy = {
        ...newPolicySchema,
        policyName,
        productId: uuid
    }
    _policySchema.push(newPolicy)
    setLocalStorage(LOCAL_POLICY_SCHEMA, _policySchema)

    emitter.emit('new-policy') 
    
};

const getSavedContract = (contractId: string) => {
    if (!initalized) {
        init();
    }
    const result = _savedPolicy.find((d) => d.contractId === contractId)
    if (result) {
        return structuredClone(result)
    }
};


const getAllSavedContract = () => {
    if (!initalized) {
        init();
    }

    return structuredClone(_savedPolicy)
};

const updateSavedContract = (contractId: string, newData: SavedPolicy) => {
    if (!initalized) {
        init();
    }
    const result = _savedPolicy.find((d) => d.contractId === contractId)

    let data = newData
    if (result) {
        data = {
            ...result,
            ...newData
        }

    }

    _savedPolicy = _savedPolicy.filter((d) => d.contractId !== contractId).concat(data)
    setLocalStorage(LOCAL_SAVED_POLICY, _savedPolicy)
};

const saveNewContract = (data: Record<string, any>, policySchemaId: string, contractName: string) => {
    const uuid = uuidv4()

    const newPolicy = {
        data: data.data,
        policySchemaId,
        contractName,
        contractId: uuid
    }
    _savedPolicy.push(newPolicy)
    setLocalStorage(LOCAL_SAVED_POLICY, _savedPolicy)
    return uuid
};

const guestDataManager = {
    emitter,
    init,
    getPolicySchemaById,
    addPolicySchema,
    getSavedContract,
    saveNewContract,
    updateSavedContract,
    getAllPolicySchema,
    getAllSavedContract
};

export default guestDataManager;