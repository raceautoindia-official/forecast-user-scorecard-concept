import { useState } from 'react';

// Default definitions for positive and negative attributes
const defaultPosAttributes = [
  { key: 'advertising', label: 'Advertising Spend' },
  { key: 'satisfaction', label: 'Customer Satisfaction' },
  { key: 'brandReputation', label: 'Brand Reputation' },
  { key: 'marketShare', label: 'Market Share' },
  { key: 'innovationIndex', label: 'Innovation Index' },
  { key: 'customerRetention', label: 'Customer Retention' },
  { key: 'dealerNetwork', label: 'Dealer Network Strength' },
  { key: 'productQuality', label: 'Product Quality' },
  { key: 'socialMedia', label: 'Social Media Engagement' },
  { key: 'newModel', label: 'New Model Attractiveness' },
];

const defaultNegAttributes = [
  { key: 'warrantyClaims', label: 'Warranty Claims' },
  { key: 'maintenanceComplaints', label: 'Maintenance Complaints' },
  { key: 'recalls', label: 'Recalls' },
  { key: 'depreciationRate', label: 'Depreciation Rate' },
  { key: 'fuelInefficiency', label: 'Fuel Inefficiency' },
  { key: 'emissionIssues', label: 'Emission Issues' },
  { key: 'customerComplaints', label: 'Customer Complaints' },
  { key: 'accidentRates', label: 'Accident Rates' },
  { key: 'serviceDowntime', label: 'Service Downtime' },
  { key: 'costOverruns', label: 'Cost Overruns' },
];

const numYears = 5;
const defaultYearNames = Array.from({ length: numYears }, (_, i) => `Year ${i + 1}`);

// Options for the score dropdown (0 to 10)
const scoreOptions = Array.from({ length: 11 }, (_, i) => i);

const VehicleSalesScoreApp = () => {
  // Editable attribute names for positive and negative attributes
  const [posAttributes, setPosAttributes] = useState(defaultPosAttributes);
  const [negAttributes, setNegAttributes] = useState(defaultNegAttributes);

  // Editable year names
  const [yearNames, setYearNames] = useState(defaultYearNames);

  // Universal weights for each attribute.
  // For best results, sum of weights in positive table should be 1,
  // and sum in negative table should be 1.
  const initialWeights = {};
  [...posAttributes, ...negAttributes].forEach(attr => {
    // Default weight is set to 0.1 (you can adjust this as needed)
    initialWeights[attr.key] = 0.1;
  });
  const [weights, setWeights] = useState(initialWeights);

  // Attribute scores for each attribute across years.
  // Structure: { [attributeKey]: Array(numYears) }
  const initializeScores = (attributes) => {
    const data = {};
    attributes.forEach(attr => {
      // Default score is 5
      data[attr.key] = Array(numYears).fill(0);
    });
    return data;
  };
  const [posScores, setPosScores] = useState(initializeScores(posAttributes));
  const [negScores, setNegScores] = useState(initializeScores(negAttributes));

  // Handlers for editing attribute names
  const handlePosAttributeNameChange = (key, newName) => {
    setPosAttributes(posAttributes.map(attr => attr.key === key ? { ...attr, label: newName } : attr));
  };
  const handleNegAttributeNameChange = (key, newName) => {
    setNegAttributes(negAttributes.map(attr => attr.key === key ? { ...attr, label: newName } : attr));
  };

  // Handler for editing year names
  const handleYearNameChange = (index, newName) => {
    const updated = [...yearNames];
    updated[index] = newName;
    setYearNames(updated);
  };

  // Handler to update universal weight for an attribute
  const handleWeightChange = (key, value) => {
    setWeights({ ...weights, [key]: parseFloat(value) });
  };

  // Handler to update a score for a positive attribute for a specific year
  const handlePosScoreChange = (key, year, value) => {
    const newScores = [...posScores[key]];
    newScores[year] = parseInt(value, 10);
    setPosScores({ ...posScores, [key]: newScores });
  };

  // Handler to update a score for a negative attribute for a specific year
  const handleNegScoreChange = (key, year, value) => {
    const newScores = [...negScores[key]];
    newScores[year] = parseInt(value, 10);
    setNegScores({ ...negScores, [key]: newScores });
  };

  // Calculate final scores for each year using the raw weighted sum.
  // Formula: Score = (Sum over positives: score * weight) - (Sum over negatives: score * weight)
  const calculateScores = () => {
    const finalScores = [];
    for (let i = 0; i < numYears; i++) {
      let posSum = 0, negSum = 0;
      posAttributes.forEach(attr => {
        const score = posScores[attr.key][i];
        const weight = weights[attr.key] || 0;
        posSum += score * weight;
      });
      negAttributes.forEach(attr => {
        const score = negScores[attr.key][i];
        const weight = weights[attr.key] || 0;
        negSum += score * weight;
      });
      const yearScore = posSum - negSum;
      finalScores.push(yearScore);
    }
    return finalScores;
  };

  const scores = calculateScores();

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Vehicle Sales Score Calculator</h1>

      {/* Edit Year Names */}
      <section>
        <h2>Edit Year Names</h2>
        {yearNames.map((name, index) => (
          <div key={index} style={{ marginBottom: '5px' }}>
            <label>
              Year {index + 1} Name: 
              <input
                type="text"
                value={name}
                onChange={(e) => handleYearNameChange(index, e.target.value)}
                style={{ marginLeft: '10px' }}
              />
            </label>
          </div>
        ))}
      </section>

      {/* Positive Attributes: Editable Names & Universal Weights */}
      <section style={{ marginTop: '20px' }}>
        <h2>Positive Attributes</h2>
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Attribute Name</th>
              <th>Universal Weight (0 to 1)</th>
            </tr>
          </thead>
          <tbody>
            {posAttributes.map(attr => (
              <tr key={attr.key}>
                <td>
                  <input
                    type="text"
                    value={attr.label}
                    onChange={(e) =>
                      handlePosAttributeNameChange(attr.key, e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={weights[attr.key]}
                    onChange={(e) => handleWeightChange(attr.key, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Negative Attributes: Editable Names & Universal Weights */}
      <section style={{ marginTop: '20px' }}>
        <h2>Negative Attributes</h2>
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Attribute Name</th>
              <th>Universal Weight (0 to 1)</th>
            </tr>
          </thead>
          <tbody>
            {negAttributes.map(attr => (
              <tr key={attr.key}>
                <td>
                  <input
                    type="text"
                    value={attr.label}
                    onChange={(e) =>
                      handleNegAttributeNameChange(attr.key, e.target.value)
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    min="0"
                    max="1"
                    step="0.01"
                    value={weights[attr.key]}
                    onChange={(e) => handleWeightChange(attr.key, e.target.value)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Positive Attributes Scores (Dropdowns) */}
      <section style={{ marginTop: '20px' }}>
        <h2>Positive Attributes Scores</h2>
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Attribute</th>
              {yearNames.map((yearName, index) => (
                <th key={index}>{yearName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {posAttributes.map(attr => (
              <tr key={attr.key}>
                <td>{attr.label}</td>
                {yearNames.map((_, i) => (
                  <td key={i}>
                    <select
                      value={posScores[attr.key][i]}
                      onChange={(e) => handlePosScoreChange(attr.key, i, e.target.value)}
                    >
                      {scoreOptions.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Negative Attributes Scores (Dropdowns) */}
      <section style={{ marginTop: '20px' }}>
        <h2>Negative Attributes Scores</h2>
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              <th>Attribute</th>
              {yearNames.map((yearName, index) => (
                <th key={index}>{yearName}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {negAttributes.map(attr => (
              <tr key={attr.key}>
                <td>{attr.label}</td>
                {yearNames.map((_, i) => (
                  <td key={i}>
                    <select
                      value={negScores[attr.key][i]}
                      onChange={(e) => handleNegScoreChange(attr.key, i, e.target.value)}
                    >
                      {scoreOptions.map(option => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Final Scores */}
      <section style={{ marginTop: '20px' }}>
        <h2>Yearly Scores</h2>
        <ul>
          {scores.map((score, i) => (
            <li key={i}>
              {yearNames[i]}: {score.toFixed(2)}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default VehicleSalesScoreApp;


// import { useState } from 'react';

// // Default definitions for positive and negative attributes
// const defaultPosAttributes = [
//   { key: 'advertising', label: 'Advertising Spend' },
//   { key: 'satisfaction', label: 'Customer Satisfaction' },
//   { key: 'brandReputation', label: 'Brand Reputation' },
//   { key: 'marketShare', label: 'Market Share' },
//   { key: 'innovationIndex', label: 'Innovation Index' },
//   { key: 'customerRetention', label: 'Customer Retention' },
//   { key: 'dealerNetwork', label: 'Dealer Network Strength' },
//   { key: 'productQuality', label: 'Product Quality' },
//   { key: 'socialMedia', label: 'Social Media Engagement' },
//   { key: 'newModel', label: 'New Model Attractiveness' },
// ];

// const defaultNegAttributes = [
//   { key: 'warrantyClaims', label: 'Warranty Claims' },
//   { key: 'maintenanceComplaints', label: 'Maintenance Complaints' },
//   { key: 'recalls', label: 'Recalls' },
//   { key: 'depreciationRate', label: 'Depreciation Rate' },
//   { key: 'fuelInefficiency', label: 'Fuel Inefficiency' },
//   { key: 'emissionIssues', label: 'Emission Issues' },
//   { key: 'customerComplaints', label: 'Customer Complaints' },
//   { key: 'accidentRates', label: 'Accident Rates' },
//   { key: 'serviceDowntime', label: 'Service Downtime' },
//   { key: 'costOverruns', label: 'Cost Overruns' },
// ];

// const numYears = 5;
// const defaultYearNames = Array.from({ length: numYears }, (_, i) => `Year ${i + 1}`);

// // Options for the attribute score dropdown (0 to 10)
// const scoreOptions = Array.from({ length: 11 }, (_, i) => i);

// const VehicleSalesScoreApp = () => {
//   // Editable attribute names (for positive and negative sets)
//   const [posAttributes, setPosAttributes] = useState(defaultPosAttributes);
//   const [negAttributes, setNegAttributes] = useState(defaultNegAttributes);
  
//   // Editable year names
//   const [yearNames, setYearNames] = useState(defaultYearNames);

//   // Universal weights: an object keyed by attribute key.
//   // Default weight is 0.5 for every attribute.
//   const initialWeights = {};
//   [...posAttributes, ...negAttributes].forEach(attr => {
//     initialWeights[attr.key] = 0.1;
//   });
//   const [weights, setWeights] = useState(initialWeights);

//   // Attribute scores for each parameter across years.
//   // Structure: { [attributeKey]: Array(numYears) }
//   const initializeScores = (attributes) => {
//     const data = {};
//     attributes.forEach(attr => {
//       data[attr.key] = Array(numYears).fill(5);
//     });
//     return data;
//   };
//   const [posScores, setPosScores] = useState(initializeScores(posAttributes));
//   const [negScores, setNegScores] = useState(initializeScores(negAttributes));

//   // Handlers for editing attribute names
//   const handlePosAttributeNameChange = (key, newName) => {
//     setPosAttributes(posAttributes.map(attr => attr.key === key ? { ...attr, label: newName } : attr));
//   };
//   const handleNegAttributeNameChange = (key, newName) => {
//     setNegAttributes(negAttributes.map(attr => attr.key === key ? { ...attr, label: newName } : attr));
//   };

//   // Handler for editing year names
//   const handleYearNameChange = (index, newName) => {
//     const updated = [...yearNames];
//     updated[index] = newName;
//     setYearNames(updated);
//   };

//   // Handler to update universal weight for a given attribute key
//   const handleWeightChange = (key, value) => {
//     setWeights({ ...weights, [key]: parseFloat(value) });
//   };

//   // Handler to update a score for a positive attribute for a specific year
//   const handlePosScoreChange = (key, year, value) => {
//     const newScores = [...posScores[key]];
//     newScores[year] = parseInt(value, 10);
//     setPosScores({ ...posScores, [key]: newScores });
//   };

//   // Handler to update a score for a negative attribute for a specific year
//   const handleNegScoreChange = (key, year, value) => {
//     const newScores = [...negScores[key]];
//     newScores[year] = parseInt(value, 10);
//     setNegScores({ ...negScores, [key]: newScores });
//   };

//   // Calculate scores for each year using the weighted scoring model.
//   // For each year:
//   //   rawScore = sum_pos( score/10 * weight ) - sum_neg( score/10 * weight )
//   //   maxPos = sum_pos( 10/10 * weight ) = sum_pos(weight)
//   //   maxNeg = sum_neg( weight )
//   // Then normalized score = ((rawScore + maxNeg) / (maxPos+maxNeg)) * 10
//   const calculateScores = () => {
//     const finalScores = [];
//     for (let i = 0; i < numYears; i++) {
//       let posSum = 0, negSum = 0;
//       let maxPos = 0, maxNeg = 0;
//       posAttributes.forEach(attr => {
//         const score = posScores[attr.key][i];
//         const weight = weights[attr.key] || 0;
//         posSum += (score / 10) * weight;
//         maxPos += weight;
//       });
//       negAttributes.forEach(attr => {
//         const score = negScores[attr.key][i];
//         const weight = weights[attr.key] || 0;
//         negSum += (score / 10) * weight;
//         maxNeg += weight;
//       });
//       const weightedSum = posSum - negSum;
//       const totalPossible = maxPos + maxNeg;
//       const normalizedScore = totalPossible > 0 ? ((weightedSum + maxNeg) / totalPossible) * 10 : 0;
//       finalScores.push(normalizedScore);
//     }
//     return finalScores;
//   };

//   const scores = calculateScores();

//   return (
//     <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
//       <h1>Vehicle Sales Score Calculator</h1>

//       {/* Edit Year Names */}
//       <section>
//         <h2>Edit Year Names</h2>
//         {yearNames.map((name, index) => (
//           <div key={index} style={{ marginBottom: '5px' }}>
//             <label>
//               Year {index + 1} Name: 
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => handleYearNameChange(index, e.target.value)}
//                 style={{ marginLeft: '10px' }}
//               />
//             </label>
//           </div>
//         ))}
//       </section>

//       {/* Universal Weights & Editable Attribute Names for Positive Attributes */}
//       <section style={{ marginTop: '20px' }}>
//         <h2>Positive Attributes</h2>
//         <table border="1" cellPadding="5">
//           <thead>
//             <tr>
//               <th>Attribute Name</th>
//               <th>Universal Weight (0 to 1)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {posAttributes.map(attr => (
//               <tr key={attr.key}>
//                 <td>
//                   <input
//                     type="text"
//                     value={attr.label}
//                     onChange={(e) =>
//                       handlePosAttributeNameChange(attr.key, e.target.value)
//                     }
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="number"
//                     min="0"
//                     max="1"
//                     step="0.01"
//                     value={weights[attr.key]}
//                     onChange={(e) => handleWeightChange(attr.key, e.target.value)}
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>

//       {/* Universal Weights & Editable Attribute Names for Negative Attributes */}
//       <section style={{ marginTop: '20px' }}>
//         <h2>Negative Attributes</h2>
//         <table border="1" cellPadding="5">
//           <thead>
//             <tr>
//               <th>Attribute Name</th>
//               <th>Universal Weight (0 to 1)</th>
//             </tr>
//           </thead>
//           <tbody>
//             {negAttributes.map(attr => (
//               <tr key={attr.key}>
//                 <td>
//                   <input
//                     type="text"
//                     value={attr.label}
//                     onChange={(e) =>
//                       handleNegAttributeNameChange(attr.key, e.target.value)
//                     }
//                   />
//                 </td>
//                 <td>
//                   <input
//                     type="number"
//                     min="0"
//                     max="1"
//                     step="0.01"
//                     value={weights[attr.key]}
//                     onChange={(e) => handleWeightChange(attr.key, e.target.value)}
//                   />
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>

//       {/* Positive Attributes Scores */}
//       <section style={{ marginTop: '20px' }}>
//         <h2>Positive Attributes Scores</h2>
//         <table border="1" cellPadding="5">
//           <thead>
//             <tr>
//               <th>Attribute</th>
//               {yearNames.map((yearName, index) => (
//                 <th key={index}>{yearName}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {posAttributes.map(attr => (
//               <tr key={attr.key}>
//                 <td>{attr.label}</td>
//                 {yearNames.map((_, i) => (
//                   <td key={i}>
//                     <select
//                       value={posScores[attr.key][i]}
//                       onChange={(e) => handlePosScoreChange(attr.key, i, e.target.value)}
//                     >
//                       {scoreOptions.map(option => (
//                         <option key={option} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>

//       {/* Negative Attributes Scores */}
//       <section style={{ marginTop: '20px' }}>
//         <h2>Negative Attributes Scores</h2>
//         <table border="1" cellPadding="5">
//           <thead>
//             <tr>
//               <th>Attribute</th>
//               {yearNames.map((yearName, index) => (
//                 <th key={index}>{yearName}</th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {negAttributes.map(attr => (
//               <tr key={attr.key}>
//                 <td>{attr.label}</td>
//                 {yearNames.map((_, i) => (
//                   <td key={i}>
//                     <select
//                       value={negScores[attr.key][i]}
//                       onChange={(e) => handleNegScoreChange(attr.key, i, e.target.value)}
//                     >
//                       {scoreOptions.map(option => (
//                         <option key={option} value={option}>
//                           {option}
//                         </option>
//                       ))}
//                     </select>
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </section>

//       {/* Final Scores */}
//       <section style={{ marginTop: '20px' }}>
//         <h2>Yearly Scores</h2>
//         <ul>
//           {scores.map((score, i) => (
//             <li key={i}>
//               {yearNames[i]}: {score.toFixed(2)}
//             </li>
//           ))}
//         </ul>
//       </section>
//     </div>
//   );
// };

// export default VehicleSalesScoreApp;



