const setEditModal = (id) => {
    console.log(id);
    const xhttp = new XMLHttpRequest();

    xhttp.open("GET", `http://localhost:3000/api/${id}`, false);
    xhttp.send();

    const envelope = JSON.parse(xhttp.responseText);

    const { category, budget } = envelope;

    document.getElementById('category').value = category;
    document.getElementById('budget').value = budget;

    // setting up the action url for the envelope
    document.getElementById('editForm').action = `http://localhost:3000/api/${id}`;
}

const deleteEnvelope = (id) => {
    const xhttp = new XMLHttpRequest();
    console.log(id);

    xhttp.open("DELETE", `http://localhost:3000/api/${id}`, false);
    xhttp.send();

    // Reloading the page
    location.reload();
}

const loadEnvelopes = () => {
    const xhttp = new XMLHttpRequest();

    xhttp.open("GET", "http://localhost:4000/api/", false);
    xhttp.send();

    const envelopes = JSON.parse(xhttp.responseText);

    for (let envelope of envelopes) {
        const x = `
            <div class="col-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">${envelope.category}</h5>

                        <div>Allocated Budget: ${envelope.budget}</div>

                        <hr>

                        <button type="button" class="btn btn-danger">Delete</button>
                        <button types="button" class="btn btn-primary" data-toggle="modal"
                            data-target="#editEnvelopeModal" onClick="setEditModal(${envelope._id})">
                            Edit
                        </button>
                    </div>
                </div>
            </div>
        `

        document.getElementById('envelopes').innerHTML = document.getElementById('envelopes').innerHTML + x;
    }
}

loadEnvelopes();