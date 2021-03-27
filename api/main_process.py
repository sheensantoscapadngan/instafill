from api.document_helpers.pdf_helper import read_text_from_img
from api.document_helpers.field_helper_image import extract_field_fill_positions, extract_fillable_positions
from api.document_helpers.field_helper_text import extract_master_text_embeddings, extract_master_dict, match_field_to_master
from api.testers.scripts.tester import show_instafill_result, show_fillable_positions


def process_request(pages_img, master_document, model):
    try:
        # -------Analyze PDF to extract text"
        fields = read_text_from_img(pages_img)

        # -------Map fields to a position corresponding to its autofill location
        field_fill_positions, pages_data = extract_field_fill_positions(
            fields, pages_img)

        master_dict = extract_master_dict(master_document)
        master_text_embeddings = extract_master_text_embeddings(
            master_dict, model)
        instafill_dict, used_lines_dict = match_field_to_master(
            field_fill_positions, master_dict, master_text_embeddings, model)

        fillable_positions = extract_fillable_positions(
            pages_data, used_lines_dict)

        show_instafill_result(
            instafill_dict, pages_img)

        show_fillable_positions(
            fillable_positions, pages_img)

        return instafill_dict, fillable_positions

    except Exception as e:
        print(e)
        return None, None
    
