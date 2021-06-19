//import nanoid dari package
const { nanoid } = require('nanoid');
const notes = require('./notes');

const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;

    //id berupa string, diproses dari sisi server
    const id = nanoid(16);

    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        title, tags, body, id, createdAt, updatedAt,
    };

    notes.push(newNote);

    //mengecek apakah newNotes sudah masuk ke array notes
    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil ditambahkan',
            data: {
                noteId: id,
            },
        });

        response.code(201); //HTTP response status codes => 201 created
        return response;
    }

    const response = h.response({
        status: 'Fail',
        message: 'Catatan gagal ditambahkan',
    });
    response.code(500); //HTTP response status code => 500 Internal Server Error
    return response;
};

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        notes,
    },
});

//menampilkan detail dari notes yang sudah dibuat /node/{id}
const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    /*Setelah mendapatkan nilai id, dapatkan objek note dengan id tersebut dari 
    objek array notes. Manfaatkan method array filter() untuk mendapatkan objeknya.*/
    const note = notes.filter((n) => n.id === id)[0];

    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan tidak ditemukan',
    });

    response.code(404); //HTTP response status code => 404 Not Found
    return response;
};

const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const { title, tags , body} = request.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title,
            tags,
            body,
            updatedAt,
        };

        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil diperbarui',
        });
        response.code(200); //HTTP response status codes => 200 OK
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Gagal memperbarui catatan. Id tidak ditemukan',
    });
    response.code(404); //HTTP response status code => 404 Not Found
    return response;
};

const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = notes.findIndex((note) => note.id === id);

    /*
    Lakukan pengecekan terhadap nilai index, pastikan nilainya tidak -1 
    bila hendak menghapus catatan. Nah, untuk menghapus data pada array 
    berdasarkan index, gunakan method array splice().
    */
    if (index !== -1) {
        notes.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'Catatan berhasil dihapus',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'Catatan gagal dihapus. Id tidak ditemukan',
    });
    response.code(404);
    return response;
};

module.exports = {
    addNoteHandler, 
    getAllNotesHandler,
    getNoteByIdHandler,
    editNoteByIdHandler,
    deleteNoteByIdHandler,
};