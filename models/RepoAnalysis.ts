import mongoose, { Schema, models, model } from "mongoose";

const RepoAnalysisSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    repoUrl: {
      type: String,
      required: true,
      trim: true,
    },

    repoName: {
      type: String,
      required: true,
      trim: true,
    },

    techStack: {
      type: String,
      default: "",
    },

    score: {
      type: Number,
      required: true,
      default: 0,
    },

    issuesFound: {
      type: Number,
      required: true,
      default: 0,
    },

    interviewReady: {
      type: Boolean,
      required: true,
      default: false,
    },

    improvements: {
      type: [String],
      default: [],
    },

    recommendation: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const RepoAnalysis =
  models.RepoAnalysis || model("RepoAnalysis", RepoAnalysisSchema);

export default RepoAnalysis;