import Po from './Gettext/Generator/POGenerator';
import Mo from './Gettext/Generator/MOGenerator';
import Json from './Gettext/Generator/JSONGenerator';
import Xml from './Gettext/Generator/XMLGenerator';

export const POGenerator =  Po;
export const MOGenerator =  Mo;
export const JSONGenerator = Json;
export const XMLGenerator = Xml;

export default {
    PO: new POGenerator(),
    MO: new MOGenerator(),
    JSON: new JSONGenerator(),
    XML: new XMLGenerator()
}
