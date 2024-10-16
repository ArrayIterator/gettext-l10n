import Mo from './Gettext/Reader/MOReader';
import Po from './Gettext/Reader/POReader';
import Json from './Gettext/Reader/JSONReader';
import Xml from './Gettext/Reader/XMLReader';

export const POReader =  Po;
export const MOReader =  Mo;
export const JSONReader =  Json;
export const XMLReader = Xml;

export default {
    PO: new POReader(),
    MO: new MOReader(),
    JSON: new JSONReader(),
    XML: new XMLReader()
}
