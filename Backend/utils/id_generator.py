def get_next_sequence(db, name):

    counter = db.counters.find_one_and_update(
        {"_id": name},
        {"$inc": {"sequence_value": 1}},
        upsert=True,
        return_document=True
    )

    return counter["sequence_value"]