from api.document_helpers.pdf_helper import read_text_from_document,extract_page_dimensions,delete_pdf_and_master
from api.document_helpers.field_helper_image import extract_field_fill_positions
from api.cloud_storage.cloud_storage_helper import upload_pdf_to_storage,delete_pdf_from_storage
from api.document_helpers.field_helper_text import extract_master_text_embeddings,extract_master_dict,match_field_to_master

def process_request(pdf_filepath,master_document_filepath,model):
    pdf_uri,pdf_name = upload_pdf_to_storage(pdf_filepath)
    json_list = read_text_from_document(pdf_uri)   #-------Analyze PDF to extract text"
    page_dims = extract_page_dimensions(json_list)

    #fields = extract_fields_from_json(json_list)    #------Extract fields and their bounding box positions
    fields = {1:{'cell number': {'top_left': (204,165),'top_right': (229,165), 'bot_left': (204,172), 'bot_right':(229,172)}}}

    field_fill_positions,fillable_positions = extract_field_fill_positions(fields,pdf_filepath)  #-------Map fields to a position corresponding to its autofill location

    master_dict = extract_master_dict(master_document_filepath)
    master_text_embeddings = extract_master_text_embeddings(master_dict,model)
    instafill_dict = match_field_to_master(field_fill_positions,master_dict,master_text_embeddings,model)

    delete_pdf_from_storage(pdf_name)
    delete_pdf_and_master(pdf_filepath,master_document_filepath)
    return instafill_dict
