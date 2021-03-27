from sentence_transformers import SentenceTransformer, util, InputExample, losses
from torch.utils.data import DataLoader
import re

MATCH_THRESHOLD = 0.68


def convert_bytes_to_string(master_bytes):
    return "".join(map(chr,master_bytes))

def extract_master_text_embeddings(master_dict, model):
    master_text_embeddings = {}
    for key, _ in master_dict.items():
        master_text_embeddings[key] = model.encode(key, convert_to_tensor=True)
    return master_text_embeddings


def text_find_match(document_text, master_text_embeddings, model):
    document_embedding = model.encode(document_text, convert_to_tensor=True)
    max_score, max_field = 0, None
    for field, field_embedding in master_text_embeddings.items():
        cos_sim = util.pytorch_cos_sim(document_embedding, field_embedding)
        if cos_sim > max_score and cos_sim >= MATCH_THRESHOLD:
            max_score, max_field = cos_sim, field
    return max_field, max_score


def extract_master_dict(master_document):
    master_dict = {}
    for pair in master_document.split(';'):
        if not any(c.isalpha() for c in pair):
            continue
        key, value = pair.split(':')
        key = re.sub(r'[^A-Za-z ]+', '', key).lower()
        master_dict[key] = value
    return master_dict


def process_final_position(box_position, center_x, field):
    left_point = box_position[0]
    if left_point[0] <= center_x:  # if line is to be filled up on top
        return ((int(center_x), box_position[0][1]), box_position[1])
    return box_position


def match_field_to_master(field_fill_positions, master_dict, master_text_embeddings, model):
    instafill_dict = {}
    used_fields = set()
    used_lines_dict = {}
    for page, fields in field_fill_positions.items():
        used_lines = []
        field_value_dict = {}
        for field, content in fields.items():
            print("CHECKING", field)
            box_position = content['line']
            center_x = content['center_x']

            max_field, max_score = text_find_match(
                field, master_text_embeddings, model)

            # handle repeating fields
            if '*_' in field:
                field_value_dict[field] = {
                    'value': '', 'position': box_position
                }
                used_lines.append(box_position)
                continue

            if max_field is None:
                continue

            used_lines.append(box_position)
            box_position = process_final_position(
                box_position, center_x, field)

            used_fields.add(field)
            value = master_dict[max_field]
            print("MATCHING", field, "TO", value)
            field_value_dict[field] = {
                'value': value, 'position': box_position}

        used_lines_dict[page] = used_lines
        instafill_dict[page] = field_value_dict
    return instafill_dict, used_lines_dict


def define_train_examples():
    train_examples = []
    with open("instafill_text/good_phrase_pairs.txt", "r") as file:
        good_phrase_pairs = file.read()
        pairs_list = good_phrase_pairs.split("|")
        for pair in pairs_list:
            if len(pair) == 0:
                continue
            first, second = pair.split(":")
            train_examples.append(InputExample(
                texts=[first, second], label=0.9))

    with open("instafill_text/bad_phrase_pairs.txt", "r") as file:
        bad_phrase_pairs = file.read()
        pairs_list = bad_phrase_pairs.split("|")
        for pair in pairs_list:
            if len(pair) == 0:
                continue
            first, second = pair.split(":")
            train_examples.append(InputExample(
                texts=[first, second], label=0.1))

    return train_examples


def train_model():
    model = SentenceTransformer(
        r'E:\PROJECTS\instafill_backend\instafill_text\model\field_model1')
    train_examples = define_train_examples()
    train_dataloader = DataLoader(train_examples, shuffle=True, batch_size=16)
    train_loss = losses.CosineSimilarityLoss(model)

    model.fit(train_objectives=[
              (train_dataloader, train_loss)], epochs=10, warmup_steps=100)
    model.save('instafill_text/model/field_model1')


def test_model(model):
    sentences = ["mobile number", "cellphone number", "telephone number"]
    embeddings = [model.encode(sentence, convert_to_tensor=True)
                  for sentence in sentences]
    cos_sim = util.pytorch_cos_sim(embeddings[0], embeddings[1])
    print("SIMILARITY OF 1 AND 2 IS", cos_sim)
    cos_sim = util.pytorch_cos_sim(embeddings[0], embeddings[2])
    print("SIMILARITY OF 1 AND 3 IS", cos_sim)
