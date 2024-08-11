import React from 'react';
import './display.css'; 

const Person = (props) => {
  const { url, imgurl, comment } = props.persons;

  return (
    <div className="person-container"> {/* Use 'person-container' class to style the entire container */}
      <table className="person-table"> {/* Use 'person-table' class to style the table */}
        <tbody>
          <tr>
            <th className="subheading">URL</th> {/* Use 'subheading' class for table header */}
            <td>{url}</td>
          </tr>
          <tr>
            <th className="subheading">IMG URL</th> {/* Use 'subheading' class for table header */}
            <td>{imgurl}</td>
          </tr>
          <tr>
            <th className="subheading">COMMENT</th> {/* Use 'subheading' class for table header */}
            <td>{comment}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Person;