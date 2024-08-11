document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('reportForm');
  const statusMessage = document.getElementById('statusMessage');

  form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const mediaInput = document.getElementById('mediaInput').value;
    const reportReason = document.getElementById('reportReason').value;

    const data = {
      mediaInput: mediaInput,
      reportReason: reportReason
    };

    try {
      const response = await fetch('https://report-kavach.aahanaasharrma.repl.co/submit-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        const responseData = await response.json();
        statusMessage.textContent = 'Report submitted successfully.';
        console.log('Inserted Report:', responseData);
      } else {
        statusMessage.textContent = 'Failed to submit report.';
      }
    } catch (error) {
      statusMessage.textContent = 'An error occurred.';
      console.error('Error:', error);
    }
  });
});
