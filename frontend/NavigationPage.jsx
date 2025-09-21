import React, { useState, useEffect } from "react";
import "./NavigationPage.css";
import { useNavigate, useLocation } from "react-router-dom";
import stairIcon from "./assets/stair_icon.svg";
import walkIcon from "./assets/walk_icon.svg";
import rightArrowIcon from "./assets/right_arrow_icon.svg";
import leftArrowIcon from "./assets/left_arrow_icon.svg";
import passageIcon from "./assets/passage_icon.svg";
import endNavIcon from "./assets/end_nav_icon.svg";

function NavigationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromLocation = location.state?.from || "306 IPDC Lab";
  const toLocation = location.state?.to || "314A Food Science Lab";

  const [steps, setSteps] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [processingTime, setProcessingTime] = useState(0);
  const [estimatedTime, setEstimatedTime] = useState(0);

  const floorGraph = {
    "306 IPDC Lab": [
      ["307A Classroom", 1.5, "LEFT then take RIGHT"],
      ["Elevator", 1, "RIGHT"],
    ],
    "307A Classroom": [
      ["306 IPDC Lab", 1.5, "LEFT then again take LEFT"],
      ["307B Control Lab", 2, "STRAIGHT"],
    ],
    "307B Control Lab": [
      ["307A Classroom", 2, "STRAIGHT"],
      ["308A Classroom", 0.5, "STRAIGHT"],
    ],
    "308A Classroom": [
      ["307B Control Lab", 0.5, "STRAIGHT"],
      ["309A Classroom", 2, "STRAIGHT"],
    ],
    "309A Classroom": [
      ["308A Classroom", 2, "STRAIGHT"],
      ["309B Analog Lab", 2.5, "RIGHT then take LEFT"],
      ["Washroom", 4.5, "STRAIGHT"],
    ],
    "309B Analog Lab": [
      ["309A Classroom", 2.5, "RIGHT then again take RIGHT"],
      ["310 Classroom", 2.5, "STRAIGHT"],
    ],
    Washroom: [
      ["309A Classroom", 4.5, "STRAIGHT"],
      ["313B Classroom", 1.5, "RIGHT"],
      ["314A Food Science Lab", 4, "STRAIGHT towards balcony then take RIGHT"],
    ],
    "310 Classroom": [
      ["309B Analog Lab", 2.5, "STRAIGHT"],
      ["311 Faculty Room", 1.5, "RIGHT"],
    ],
    "311 Faculty Room": [
      ["310 Classroom", 1.5, "LEFT"],
      ["312A Classroom", 2.5, "STRAIGHT"],
    ],
    "312A Classroom": [
      ["311 Faculty Room", 2.5, "STRAIGHT"],
      ["313A Classroom", 1.5, "RIGHT"],
    ],
    "313A Classroom": [
      ["312A Classroom", 1.5, "LEFT"],
      ["313B Classroom", 2.5, "STRAIGHT"],
    ],
    "313B Classroom": [
      ["313A Classroom", 2.5, "STRAIGHT"],
      ["Washroom", 1.5, "LEFT"],
    ],
    "314A Food Science Lab": [
      ["Washroom", 4, "towards Balcony then take LEFT"],
      ["314B Biology Lab", 2, "STRAIGHT"],
    ],
    "314B Biology Lab": [
      ["314A Food Science Lab", 2, "STRAIGHT"],
      ["Elevator", 3, "STRAIGHT towards Junction then take RIGHT"],
    ],
    Elevator: [
      ["314B Biology Lab", 3, "After Exiting from lift take RIGHT then LEFT"],
      ["306 IPDC Lab", 1, "After exiting from Lift take LEFT"],
    ],
  };

  class PriorityQueue {
    constructor() {
      this.queue = [];
    }

    enqueue(item, priority) {
      this.queue.push({ item, priority });
      this.queue.sort((a, b) => a.priority - b.priority);
    }

    dequeue() {
      return this.queue.shift();
    }

    isEmpty() {
      return this.queue.length === 0;
    }
  }

  const dijkstra = (graph, start) => {
    const distances = {};
    const previousNodes = {};
    const directions = {};
    let nodesExpanded = 0;

    for (const node of Object.keys(graph)) {
      distances[node] = Infinity;
      previousNodes[node] = null;
      directions[node] = [];
    }

    distances[start] = 0;
    const priorityQueue = new PriorityQueue();
    priorityQueue.enqueue(start, 0);

    const startTime = performance.now();

    while (!priorityQueue.isEmpty()) {
      const { item: currentNode } = priorityQueue.dequeue();
      nodesExpanded++;

      if (distances[currentNode] === Infinity) continue;

      const neighbors = graph[currentNode] || [];

      for (const [neighbor, weight, direction] of neighbors) {
        const distance = distances[currentNode] + weight;

        if (distance < distances[neighbor]) {
          distances[neighbor] = distance;
          previousNodes[neighbor] = currentNode;
          directions[neighbor] = [...directions[currentNode], [neighbor, direction, weight]];
          priorityQueue.enqueue(neighbor, distance);
        }
      }
    }

    const endTime = performance.now();
    const dijkstraTime = endTime - startTime;

    return {
      distances,
      previousNodes,
      directions,
      performance: {
        time: dijkstraTime,
        nodesExpanded,
      },
    };
  };

  const getIconForDirection = (directionText) => {
    const lowerDirection = directionText.toLowerCase();

    if (lowerDirection.includes("right")) {
      return rightArrowIcon;
    } else if (lowerDirection.includes("left")) {
      return leftArrowIcon;
    } else if (lowerDirection.includes("straight") || lowerDirection.includes("go")) {
      return walkIcon;
    } else if (lowerDirection.includes("stair") || lowerDirection.includes("elevator") || lowerDirection.includes("lift")) {
      return stairIcon;
    } else if (lowerDirection.includes("passage") || lowerDirection.includes("corridor")) {
      return passageIcon;
    } else {
      return walkIcon;
    }
  };

  const calculateSimpleETA = (totalDistance) => {
    const timeInSeconds = totalDistance / 1.4;
    return Math.round(timeInSeconds / 60);
  };

  const generateStepTimes = (steps, startTime = new Date()) => {
    const stepTimes = [];
    let cumulativeDistance = 0;

    steps.forEach((step, index) => {
      if (index === steps.length - 1) {
        stepTimes.push(null);
      } else {
        cumulativeDistance += step.distance;
        const totalTimeSeconds = cumulativeDistance / 1.4;
        const newTime = new Date(startTime.getTime() + totalTimeSeconds * 1000);
        stepTimes.push(
          newTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        );
      }
    });

    return stepTimes;
  };

  const calculateProcessingMetrics = (performanceData, graphSize, pathLength) => {
    const { time, nodesExpanded } = performanceData;

    return {
      executionTime: time,
      efficiency: time / nodesExpanded,
      graphCoverage: (nodesExpanded / graphSize) * 100,
      pathOptimality: pathLength > 0 ? nodesExpanded / pathLength : 0,
    };
  };

  useEffect(() => {
    console.log("NavigationPage: From =", fromLocation, "To =", toLocation);
    console.log("Available locations:", Object.keys(floorGraph));

    if (!fromLocation || !toLocation) {
      console.log("Missing from or to location");
      return;
    }

    if (!floorGraph[fromLocation] || !floorGraph[toLocation]) {
      console.error("Invalid locations:", fromLocation, toLocation);
      console.log("FromLocation exists:", !!floorGraph[fromLocation]);
      console.log("ToLocation exists:", !!floorGraph[toLocation]);

      setSteps([
        {
          icon: endNavIcon,
          text: `Invalid location: ${!floorGraph[fromLocation] ? fromLocation : toLocation} not found in building map.`,
          time: null,
        },
      ]);
      setTotalDistance(0);
      setProcessingTime(0.001);
      setEstimatedTime(0);
      return;
    }

    if (fromLocation === toLocation) {
      setSteps([
        {
          icon: endNavIcon,
          text: "You are already at your destination!",
          time: null,
        },
      ]);
      setTotalDistance(0);
      setProcessingTime(0.001);
      setEstimatedTime(0);
      return;
    }

    console.log("Running Dijkstra algorithm...");

    const result = dijkstra(floorGraph, fromLocation);
    console.log("Algorithm result:", result);

    const pathDirections = result.directions[toLocation];
    console.log("Path directions:", pathDirections);

    if (!pathDirections || pathDirections.length === 0) {
      console.log("No path found");
      setSteps([
        {
          icon: endNavIcon,
          text: "No path found to destination.",
          time: null,
        },
      ]);
      setTotalDistance(0);
      setProcessingTime(result.performance.time || 0.001);
      setEstimatedTime(0);
      return;
    }

    console.log("Converting to steps...");
    const generatedSteps = [];
    let cumulativeDistance = 0;

    pathDirections.forEach(([location, direction, distance], index) => {
      console.log(`Step ${index + 1}: ${direction} to ${location}, distance: ${distance}m`);
      cumulativeDistance += distance;
      generatedSteps.push({
        location,
        direction,
        distance,
        icon: getIconForDirection(direction),
        text: `${direction} to ${location}`,
      });
    });

    console.log("Total distance:", cumulativeDistance);

    generatedSteps.push({
      location: toLocation,
      direction: "arrive",
      distance: 0,
      icon: endNavIcon,
      text: `Arrive at ${toLocation}`,
    });

    const stepTimes = generateStepTimes(generatedSteps);

    const finalSteps = generatedSteps.map((step, index) => ({
      ...step,
      time: stepTimes[index],
    }));

    const simpleETA = calculateSimpleETA(cumulativeDistance);
    const processingMetrics = calculateProcessingMetrics(result.performance, Object.keys(floorGraph).length, pathDirections.length);

    console.log("Final calculations:");
    console.log("- ETA:", simpleETA, "minutes");
    console.log("- Processing time:", processingMetrics.executionTime, "ms");
    console.log("- Total distance:", cumulativeDistance, "m");

    setSteps(finalSteps);
    setTotalDistance(cumulativeDistance);
    setProcessingTime(processingMetrics.executionTime);
    setEstimatedTime(simpleETA);
  }, [fromLocation, toLocation]);

  return (
    <div className="navigation-container">
      <div className="navigation-topbar">
        <span className="navigation-title">MAPSTER</span>
      </div>
      <div className="navigation-header-row">
        <span className="navigation-from-label">From: {fromLocation}</span>
        {toLocation && <span className="navigation-to-label">To: {toLocation}</span>}
      </div>
      <div className="navigation-steps">
        {steps.map((step, idx) => (
          <div className="navigation-step-row" key={idx}>
            <div className="navigation-step-icon">
              {step.icon ? <img src={step.icon} alt="Step" /> : <span className="navigation-step-dot" />}
              {idx < steps.length - 1 && <div className="navigation-step-vertical-line" />}
            </div>
            <div className="navigation-step-details">
              <div className="navigation-step-text">{step.text}</div>
              {step.time && <div className="navigation-step-time">{step.time}</div>}
            </div>
          </div>
        ))}
      </div>
      <div className="navigation-info-row">
        <div className="navigation-eta-info">Total distance: {totalDistance.toFixed(1)}m</div>
        <div className="navigation-speed-info">Processing Speed: {processingTime.toFixed(4)} ms</div>
      </div>
    </div>
  );
}

export default NavigationPage;
