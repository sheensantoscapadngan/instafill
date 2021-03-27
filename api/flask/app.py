from sentence_transformers import SentenceTransformer
from api.main_process import process_request
from flask import Flask, jsonify, request
from api.document_helpers.field_helper_image import convert_pdf_to_img
from api.document_helpers.field_helper_text import convert_bytes_to_string

app = Flask(__name__)

app.model = SentenceTransformer(
    r'E:\PROJECTS\instafill_backend\api\instafill_text\model\field_model1')


@app.route('/')
def main():
    return "FAK U SHEEN"


@app.route('/process', methods=["POST"])
def receive_request_from_client():

    uploaded_files = request.files

    pdf = uploaded_files['pdf'].read()
    master = uploaded_files['master'].read()

    pages_img = convert_pdf_to_img(pdf)
    master_document = convert_bytes_to_string(master)

    instafilled, fillable_positions = process_request(pages_img, master_document, app.model)

    if instafilled is None:
        return "SORRY, THERE IS AN ERROR."

    json_result = {'instafilled': instafilled,
                   'fillable_positions': fillable_positions}
    print("JSON RESULT IS", json_result)
    return json_result


if __name__ == '__main__':
    app.debug = True
    app.run()
